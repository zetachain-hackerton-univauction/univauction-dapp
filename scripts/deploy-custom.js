const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const gateway = "0x0c487a766110c85d301d96e33579c5b317fa4995"; // Athens-3 GatewayZEVM
  const router = "0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe"; // Athens-3 UniswapV2 Router
  const gasLimit = 200000;

  const SwapMintUniversal = await ethers.getContractFactory(
    "SwapMintUniversal"
  );
  const swap = await upgrades.deployProxy(
    SwapMintUniversal,
    [gateway, router, gasLimit, deployer.address], // initialize(...) 파라미터
    { initializer: "initialize" }
  );
  await swap.deployed();

  console.log("SwapMintUniversal deployed at:", swap.address);
}
main().catch(console.error);
