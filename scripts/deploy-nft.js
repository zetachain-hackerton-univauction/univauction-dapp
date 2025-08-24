const hre = require("hardhat");

async function main() {
  // ⚠️ 여기에 Athens-3 USDC ZRC20 주소를 넣으세요
  const USDC_ZRC20 = "0xcC683A782f4B30c138787CB5576a86AF66fdc31d"; // TODO: 실제 주소로 교체
  const PRICE = 1_000_000; // 1 USDC (6 decimals)

  const TestUSDCNFT = await hre.ethers.getContractFactory("TestUSDCNFT");
  const nft = await TestUSDCNFT.deploy(USDC_ZRC20, PRICE); // 인자 넣기

  await nft.deployed();

  console.log("✅ TestUSDCNFT deployed at:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
