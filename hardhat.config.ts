import "@zetachain/localnet/tasks";
import "@zetachain/toolkit/tasks";
import "@openzeppelin/hardhat-upgrades";

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

import { getHardhatConfig } from "@zetachain/toolkit/utils";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  ...getHardhatConfig({ accounts: [process.env.PRIVATE_KEY || ""] }),
  networks: {
    zeta_athens: {
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 7001,
      url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public", // 테스트넷용 지갑 키
    },
  },
  solidity: "0.8.26",
};

export default config;
