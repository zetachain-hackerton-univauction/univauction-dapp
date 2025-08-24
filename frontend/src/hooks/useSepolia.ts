import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Sepolia network configuration
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://sepolia.etherscan.io/',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
};

export const useSepolia = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Check connection status
  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const accounts = await web3Provider.listAccounts();
      const network = await web3Provider.getNetwork();
      
      setIsConnected(accounts.length > 0);
      setAccount(accounts[0] || null);
      setIsCorrectNetwork(network.chainId === SEPOLIA_CONFIG.chainId);

      if (accounts[0]) {
        const balance = await web3Provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  // Connect to MetaMask
  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkConnection();
    } catch (error) {
      console.error('Error connecting:', error);
      throw error;
    }
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CONFIG.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        await addSepoliaNetwork();
      } else {
        throw error;
      }
    }
    await checkConnection();
  };

  // Add Sepolia network to MetaMask
  const addSepoliaNetwork = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${SEPOLIA_CONFIG.chainId.toString(16)}`,
          chainName: SEPOLIA_CONFIG.name,
          rpcUrls: [SEPOLIA_CONFIG.rpcUrl],
          blockExplorerUrls: [SEPOLIA_CONFIG.blockExplorer],
          nativeCurrency: SEPOLIA_CONFIG.nativeCurrency,
        }],
      });
    } catch (error) {
      console.error('Failed to add Sepolia network:', error);
      throw error;
    }
  };

  // Get contract instance
  const getContract = (address: string, abi: any) => {
    if (!provider || !isConnected) {
      throw new Error('Not connected to Sepolia');
    }

    const signer = provider.getSigner();
    return new ethers.Contract(address, abi, signer);
  };

  // Place bid function
  const placeBid = async (auctionAddress: string, auctionAbi: any, ideaId: number, bidAmount: string) => {
    try {
      const contract = getContract(auctionAddress, auctionAbi);
      const tx = await contract.placeBid(ideaId, {
        value: ethers.utils.parseEther(bidAmount),
        gasLimit: 300000,
      });
      
      return tx;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  };

  // Listen for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('chainChanged', checkConnection);
      checkConnection();

      return () => {
        window.ethereum.removeListener('accountsChanged', checkConnection);
        window.ethereum.removeListener('chainChanged', checkConnection);
      };
    }
  }, []);

  return {
    isConnected,
    isCorrectNetwork,
    account,
    balance,
    provider,
    connect,
    switchToSepolia,
    addSepoliaNetwork,
    getContract,
    placeBid,
    checkConnection,
    config: SEPOLIA_CONFIG,
  };
};