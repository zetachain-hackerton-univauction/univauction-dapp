import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Wallet, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ethers } from 'ethers';
import { TESTNET_CONFIG, switchToZetaChainTestnet, getNetworkName } from '../config/testnet';

interface TestnetStatusProps {
  onNetworkReady?: () => void;
}

export function TestnetStatus({ onNetworkReady }: TestnetStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<number | null>(null);
  const [account, setAccount] = useState<string>('');
  const [zetaBalance, setZetaBalance] = useState<string>('0');
  const [contractDeployed, setContractDeployed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
    checkContractDeployment();
  }, []);

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0].address);
        
        const network = await provider.getNetwork();
        setCurrentNetwork(Number(network.chainId));
        
        // Get ZETA balance if on ZetaChain testnet
        if (Number(network.chainId) === TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId) {
          const balance = await provider.getBalance(accounts[0].address);
          setZetaBalance(ethers.formatEther(balance));
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const checkContractDeployment = () => {
    const contractAddress = TESTNET_CONFIG.CONTRACTS.IDEA_PROOF_AUCTION;
    setContractDeployed(!!contractAddress && contractAddress !== '');
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to continue');
      return;
    }

    setIsLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkWalletConnection();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async () => {
    setIsLoading(true);
    try {
      await switchToZetaChainTestnet();
      await checkWalletConnection();
      toast.success('Switched to ZetaChain testnet!');
      if (onNetworkReady) onNetworkReady();
    } catch (error) {
      console.error('Error switching network:', error);
      toast.error('Failed to switch network');
    } finally {
      setIsLoading(false);
    }
  };

  const isCorrectNetwork = currentNetwork === TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId;
  const hasZetaTokens = parseFloat(zetaBalance) > 0;
  const isReady = isConnected && isCorrectNetwork && hasZetaTokens && contractDeployed;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Testnet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span>Wallet Connection</span>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <Button onClick={connectWallet} disabled={isLoading} size="sm">
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Network Status */}
        {isConnected && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span>Network</span>
            </div>
            <div className="flex items-center gap-2">
              {isCorrectNetwork ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ZetaChain Testnet
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {currentNetwork ? getNetworkName(currentNetwork) : 'Unknown'}
                  </Badge>
                  <Button onClick={switchNetwork} disabled={isLoading} size="sm">
                    Switch to ZetaChain
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ZETA Balance */}
        {isConnected && isCorrectNetwork && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>ZETA Balance</span>
            </div>
            <div className="flex items-center gap-2">
              {hasZetaTokens ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {parseFloat(zetaBalance).toFixed(4)} ZETA
                  </Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    0 ZETA
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(TESTNET_CONFIG.FAUCETS.ZETA, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Get ZETA
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Contract Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span>Smart Contract</span>
          </div>
          <div className="flex items-center gap-2">
            {contractDeployed ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Deployed
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Not Deployed
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Account Info */}
        {isConnected && (
          <div className="pt-4 border-t border-blue-200">
            <div className="text-sm text-gray-600">
              <div>Account: {account.slice(0, 6)}...{account.slice(-4)}</div>
              {contractDeployed && (
                <div className="mt-1">
                  Contract: {TESTNET_CONFIG.CONTRACTS.IDEA_PROOF_AUCTION.slice(0, 6)}...
                  {TESTNET_CONFIG.CONTRACTS.IDEA_PROOF_AUCTION.slice(-4)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ready Status */}
        {isReady && (
          <div className="pt-4 border-t border-blue-200">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Ready to use IdeaProof Platform!</span>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {!isReady && (
          <div className="pt-4 border-t border-blue-200">
            <div className="text-sm text-gray-600">
              <div className="font-medium mb-2">Setup Instructions:</div>
              <ol className="list-decimal list-inside space-y-1">
                {!isConnected && <li>Connect your MetaMask wallet</li>}
                {isConnected && !isCorrectNetwork && <li>Switch to ZetaChain testnet</li>}
                {isConnected && isCorrectNetwork && !hasZetaTokens && (
                  <li>Get ZETA tokens from the faucet</li>
                )}
                {!contractDeployed && <li>Deploy smart contracts (run setup script)</li>}
              </ol>
            </div>
          </div>
        )}

        {/* Useful Links */}
        <div className="pt-4 border-t border-blue-200">
          <div className="text-sm">
            <div className="font-medium mb-2">Useful Links:</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(TESTNET_CONFIG.FAUCETS.ZETA, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                ZETA Faucet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(TESTNET_CONFIG.EXPLORERS.ZETACHAIN, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Block Explorer
              </Button>
              {contractDeployed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(
                    `${TESTNET_CONFIG.EXPLORERS.ZETACHAIN}/address/${TESTNET_CONFIG.CONTRACTS.IDEA_PROOF_AUCTION}`,
                    '_blank'
                  )}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Contract
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}