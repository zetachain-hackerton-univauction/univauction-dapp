import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../../../frontend/src/hooks/useWallet';
import AuctionABI from '../out/Auction.sol/Auction.json';

interface AuctionItem {
  auctionId: string;
  name: string;
  description: string;
  imageUri: string;
  currentBid: string;
  currentBidder: string;
  endTime: string;
  isActive: boolean;
}

interface AuctionAppProps {
  contractAddress: string;
  rpcUrl?: string;
}

const AuctionApp: React.FC<AuctionAppProps> = ({ 
  contractAddress, 
  rpcUrl = "https://zetachain-athens-evm.blockpi.network/v1/rpc/public" 
}) => {
  const { selectedProvider, account, isConnected } = useWallet();
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [userDeposit, setUserDeposit] = useState<string>('0');
  const [availableBalance, setAvailableBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [bidAmounts, setBidAmounts] = useState<{[key: string]: string}>({});

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, AuctionABI.abi, provider);

  useEffect(() => {
    loadAuctions();
    if (isConnected && account) {
      loadUserBalance();
    }
  }, [isConnected, account]);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const activeAuctionIds = await contract.getActiveAuctions();
      const auctionData: AuctionItem[] = [];

      for (const auctionId of activeAuctionIds) {
        const auction = await contract.getAuction(auctionId);
        auctionData.push({
          auctionId: auctionId.toString(),
          name: auction.name,
          description: auction.description,
          imageUri: auction.imageUri,
          currentBid: ethers.utils.formatEther(auction.currentBid),
          currentBidder: auction.currentBidder,
          endTime: new Date(auction.endTime * 1000).toLocaleString(),
          isActive: auction.isActive,
        });
      }

      setAuctions(auctionData);
    } catch (error) {
      console.error('Error loading auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBalance = async () => {
    if (!account) return;

    try {
      const deposit = await contract.userDeposits(account);
      const available = await contract.getAvailableBalance(account);
      
      setUserDeposit(ethers.utils.formatEther(deposit));
      setAvailableBalance(ethers.utils.formatEther(available));
    } catch (error) {
      console.error('Error loading user balance:', error);
    }
  };

  const handleDeposit = async () => {
    if (!selectedProvider || !account || !depositAmount) return;

    try {
      setLoading(true);
      const signer = new ethers.providers.Web3Provider(selectedProvider.provider).getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.deposit({
        value: ethers.utils.parseEther(depositAmount)
      });

      await tx.wait();
      
      setDepositAmount('');
      await loadUserBalance();
      alert('Deposit successful!');
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Deposit failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (auctionId: string) => {
    if (!selectedProvider || !account || !bidAmounts[auctionId]) return;

    try {
      setLoading(true);
      const signer = new ethers.providers.Web3Provider(selectedProvider.provider).getSigner();
      const contractWithSigner = contract.connect(signer);

      const bidAmount = ethers.utils.parseEther(bidAmounts[auctionId]);
      const tx = await contractWithSigner.placeBid(auctionId, bidAmount);

      await tx.wait();
      
      setBidAmounts(prev => ({ ...prev, [auctionId]: '' }));
      await loadAuctions();
      await loadUserBalance();
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Bid failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (amount: string) => {
    if (!selectedProvider || !account || !amount) return;

    try {
      setLoading(true);
      const signer = new ethers.providers.Web3Provider(selectedProvider.provider).getSigner();
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      
      await loadUserBalance();
      alert('Withdrawal successful!');
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Withdrawal failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="auction-app">
        <h2>ZetaChain Auction System</h2>
        <p>Please connect your wallet to participate in auctions.</p>
      </div>
    );
  }

  return (
    <div className="auction-app" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>ZetaChain Auction System</h2>
      
      {/* User Balance Section */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>Your Account</h3>
        <p><strong>Address:</strong> {account}</p>
        <p><strong>Total Deposit:</strong> {userDeposit} ETH</p>
        <p><strong>Available Balance:</strong> {availableBalance} ETH</p>
        
        <div style={{ marginTop: '15px' }}>
          <input
            type="number"
            step="0.01"
            placeholder="Amount to deposit (ETH)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{ marginRight: '10px', padding: '8px' }}
          />
          <button 
            onClick={handleDeposit}
            disabled={loading || !depositAmount}
            style={{ padding: '8px 16px', marginRight: '10px' }}
          >
            Deposit
          </button>
          <button 
            onClick={() => {
              const amount = prompt('Enter amount to withdraw (ETH):');
              if (amount) handleWithdraw(amount);
            }}
            disabled={loading || parseFloat(availableBalance) === 0}
            style={{ padding: '8px 16px' }}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Auctions Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Active Auctions</h3>
          <button 
            onClick={loadAuctions}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Refresh
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {auctions.length === 0 && !loading && (
          <p>No active auctions at the moment.</p>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {auctions.map((auction) => (
            <div 
              key={auction.auctionId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                background: 'white'
              }}
            >
              <h4>{auction.name}</h4>
              <p>{auction.description}</p>
              
              {auction.imageUri && (
                <img 
                  src={auction.imageUri} 
                  alt={auction.name}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              
              <div style={{ marginBottom: '10px' }}>
                <p><strong>Current Bid:</strong> {auction.currentBid} ETH</p>
                <p><strong>Current Bidder:</strong> {
                  auction.currentBidder === ethers.constants.AddressZero 
                    ? 'No bids yet' 
                    : auction.currentBidder === account 
                      ? 'You' 
                      : `${auction.currentBidder.slice(0, 6)}...${auction.currentBidder.slice(-4)}`
                }</p>
                <p><strong>Ends:</strong> {auction.endTime}</p>
              </div>

              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Your bid (ETH)"
                  value={bidAmounts[auction.auctionId] || ''}
                  onChange={(e) => setBidAmounts(prev => ({
                    ...prev,
                    [auction.auctionId]: e.target.value
                  }))}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={() => handleBid(auction.auctionId)}
                  disabled={
                    loading || 
                    !bidAmounts[auction.auctionId] || 
                    parseFloat(bidAmounts[auction.auctionId]) <= parseFloat(auction.currentBid) ||
                    parseFloat(availableBalance) < parseFloat(bidAmounts[auction.auctionId] || '0')
                  }
                  style={{ 
                    width: '100%', 
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Place Bid
                </button>
                
                {parseFloat(availableBalance) < parseFloat(bidAmounts[auction.auctionId] || '0') && (
                  <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                    Insufficient balance. Please deposit more funds.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionApp;