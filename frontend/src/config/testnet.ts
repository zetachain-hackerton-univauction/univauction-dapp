// Testnet Configuration for IdeaProof Platform

export const TESTNET_CONFIG = {
  // Network Configuration
  ZETACHAIN_TESTNET: {
    chainId: 7001,
    name: "ZetaChain Athens Testnet",
    rpcUrl: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    blockExplorer: "https://zetachain-athens-3.blockscout.com/",
    nativeCurrency: {
      name: "ZETA",
      symbol: "ZETA",
      decimals: 18,
    },
  },
  
  SEPOLIA_TESTNET: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://sepolia.etherscan.io/",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },

  // Contract Addresses on ZetaChain Testnet
  CONTRACTS: {
    // Will be populated after deployment
    IDEA_PROOF_AUCTION: process.env.NEXT_PUBLIC_IDEA_PROOF_AUCTION_ADDRESS || "",
    
    // ZetaChain Protocol Contracts
    GATEWAY_ZEVM: "0x6c533f7fe93fae114d0954697069df33c9b74fd7",
    CONNECTED_SEPOLIA: "0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe",
    UNISWAP_V2_ROUTER: "0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe",
    
    // ZRC-20 Token Addresses
    WETH_ZRC20: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0",
    ETH_ZRC20: "0xd97B1de3619ed2c6BEb3860147E30cA8A7dC9891",
    BTC_ZRC20: "0x13A0c5930C028511Dc02665E7285134B6d11A5f4",
    ZETA_TOKEN: "0x5F0b1a82749cb4E2278EC87F8BF6B618dC71a8bf",
  },

  // Supported Tokens for Deposits
  SUPPORTED_TOKENS: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xd97B1de3619ed2c6BEb3860147E30cA8A7dC9891",
      decimals: 18,
      icon: "Ξ",
      chainId: 7001, // ZetaChain
      isNative: false,
    },
  ],

  // Mock Prices for Testing (in production, use real price feeds)
  MOCK_PRICES: {
    ETH: 2500, // $2500 per ETH
    BTC: 45000, // $45000 per BTC
    ZETA: 0.75, // $0.75 per ZETA
    ETH: 1.0, // 1 ETH = 1 ETH
  },

  // Transaction Settings
  TRANSACTION_SETTINGS: {
    gasLimit: 500000,
    gasPrice: "20000000000", // 20 gwei
    confirmations: 1, // For testnet
  },

  // UI Configuration
  UI_CONFIG: {
    defaultAuctionDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    minBidIncrement: 0.004, // 0.004 ETH minimum bid increment
    swapFeePercentage: 0.003, // 0.3% swap fee
    refreshInterval: 30000, // 30 seconds for real-time updates
  },

  // Faucet URLs for Getting Testnet Tokens
  FAUCETS: {
    ZETA: "https://labs.zetachain.com/get-zeta",
    SEPOLIA_ETH: "https://sepoliafaucet.com/",
    SEPOLIA_ETH_ALT: "https://faucet.sepolia.dev/",
  },

  // Block Explorer URLs
  EXPLORERS: {
    ZETACHAIN: "https://zetachain-athens-3.blockscout.com/",
    SEPOLIA: "https://sepolia.etherscan.io/",
  },
};

// Helper function to get contract address
export const getContractAddress = (contractName: keyof typeof TESTNET_CONFIG.CONTRACTS): string => {
  const address = TESTNET_CONFIG.CONTRACTS[contractName];
  if (!address) {
    console.warn(`Contract address for ${contractName} not found. Please deploy contracts first.`);
    return "";
  }
  return address;
};

// Helper function to get token info
export const getTokenInfo = (symbol: string) => {
  return TESTNET_CONFIG.SUPPORTED_TOKENS.find(token => token.symbol === symbol);
};

// Helper function to get mock price
export const getMockPrice = (symbol: string): number => {
  return TESTNET_CONFIG.MOCK_PRICES[symbol as keyof typeof TESTNET_CONFIG.MOCK_PRICES] || 1;
};

// Network switching helper
export const switchToZetaChainTestnet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId.toString(16)}`,
              chainName: TESTNET_CONFIG.ZETACHAIN_TESTNET.name,
              rpcUrls: [TESTNET_CONFIG.ZETACHAIN_TESTNET.rpcUrl],
              blockExplorerUrls: [TESTNET_CONFIG.ZETACHAIN_TESTNET.blockExplorer],
              nativeCurrency: TESTNET_CONFIG.ZETACHAIN_TESTNET.nativeCurrency,
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add ZetaChain testnet to MetaMask");
      }
    } else {
      throw switchError;
    }
  }
};

// Validation helpers
export const isValidNetwork = (chainId: number): boolean => {
  return chainId === TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId || 
         chainId === TESTNET_CONFIG.SEPOLIA_TESTNET.chainId;
};

export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case TESTNET_CONFIG.ZETACHAIN_TESTNET.chainId:
      return TESTNET_CONFIG.ZETACHAIN_TESTNET.name;
    case TESTNET_CONFIG.SEPOLIA_TESTNET.chainId:
      return TESTNET_CONFIG.SEPOLIA_TESTNET.name;
    default:
      return "Unknown Network";
  }
};

export default TESTNET_CONFIG;