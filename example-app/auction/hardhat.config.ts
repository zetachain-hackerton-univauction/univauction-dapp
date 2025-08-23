import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    zetachain_testnet: {
      url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
      chainId: 7001,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      zetachain_testnet: "your-etherscan-api-key",
    },
    customChains: [
      {
        network: "zetachain_testnet",
        chainId: 7001,
        urls: {
          apiURL: "https://zetachain-athens.blockscout.com/api",
          browserURL: "https://zetachain-athens.blockscout.com",
        },
      },
    ],
  },
};

export default config;