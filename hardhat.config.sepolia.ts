import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  mocha: {
    timeout: 40000,
  },
  networks: {
    localhost: {
      chainId: 31337,
      url: "http://localhost:8545",
    },

    sepolia: {
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gas: 6000000,
      gasPrice: 20000000000,
      // 20 gwei
      timeout: 60000,
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    },
    // Keep existing networks
    zetachain_athens: {
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 7001,
      url: "https://rpc.athens3.zetachain.com",
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
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
};

export default config;
