import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS !== undefined,
  },
  networks: {
    // BSC Testnet (for cross-chain testing)
    "bsc-testnet": {
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
      gasPrice: 10000000000,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },

    // Local development
    hardhat: {
      chainId: 31337,
    },

    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },

    // Polygon Mumbai (for cross-chain testing)
    mumbai: {
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gasPrice: 20000000000,
      url: "https://rpc-mumbai.maticvigil.com/",
    },

    // Ethereum Sepolia (for cross-chain testing)
    sepolia: {
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000,
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    },

    // ZetaChain Testnet
    "zetachain-testnet": {
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 7001,
      // 20 gwei
      gas: 5000000,

      gasPrice: 20000000000,
      url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    },
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    version: "0.8.26",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
