const hre = require("hardhat");

async function main() {
  // 배포 시 필요한 값들
  const GATEWAY = "0x0c487a766110c85d301d96e33579c5b317fa4995"; // Athens-3 GatewayZEVM 주소
  const UNISWAP_ROUTER = "0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe"; // Athens-3 UniswapV2 Router 주소
  const GAS_LIMIT = 300000; // onRevert 가스 한도
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying SwapOnlyUniversal with account:", deployer.address);

  const SwapOnlyUniversal = await hre.ethers.getContractFactory(
    "SwapOnlyUniversal"
  );
  const swap = await hre.upgrades.deployProxy(
    SwapOnlyUniversal,
    [GATEWAY, UNISWAP_ROUTER, GAS_LIMIT, deployer.address],
    {
      initializer: "initialize",
      kind: "uups", // UUPS 업그레이더블
    }
  );

  await swap.deployed();
  console.log("✅ SwapOnlyUniversal deployed at:", swap.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
