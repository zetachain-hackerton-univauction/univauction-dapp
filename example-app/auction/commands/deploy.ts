import { Command } from "commander";
import { ethers } from "ethers";
import { getAbi } from "./common";

const main = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  const network = await provider.getNetwork();
  const networkInfo = network.name ?? network.chainId;

  try {
    const { abi, bytecode } = getAbi("Auction");
    const factory = new ethers.ContractFactory(abi, bytecode, signer);

    // Deploy with initialization parameters
    const contract = await factory.deploy();
    await contract.deployed();

    // Initialize the contract
    const initTx = await contract.initialize(
      signer.address, // initialOwner
      "ZetaChain Auction NFT", // name
      "ZANFT", // symbol
      opts.gateway, // gatewayAddress
      opts.gas || 500000, // gas
      opts.uniswapRouter || ethers.constants.AddressZero, // uniswapRouterAddress
      opts.centralDeposit || signer.address // centralDepositAddress
    );
    await initTx.wait();

    console.log(
      JSON.stringify({
        contractAddress: contract.address,
        deployer: signer.address,
        network: networkInfo,
        transactionHash: contract.deployTransaction?.hash,
        initTransactionHash: initTx.hash,
        centralDepositAddress: opts.centralDeposit || signer.address,
      })
    );
  } catch (err) {
    console.error(
      "Deployment failed:",
      err instanceof Error ? err.message : err
    );
    process.exit(1);
  }
};

export const deploy = new Command("deploy")
  .description("Deploy the auction contract")
  .requiredOption(
    "-r, --rpc <url>",
    "RPC URL (default: testnet)",
    "https://zetachain-athens-evm.blockpi.network/v1/rpc/public"
  )
  .requiredOption("-k, --private-key <key>", "Private key")
  .option(
    "-g, --gateway <address>",
    "Gateway address (default: testnet)",
    "0x6c533f7fe93fae114d0954697069df33c9b74fd7"
  )
  .option(
    "-u, --uniswap-router <address>",
    "Uniswap router address"
  )
  .option(
    "-c, --central-deposit <address>",
    "Central deposit address (defaults to deployer)"
  )
  .option(
    "--gas <number>",
    "Gas limit for universal operations",
    "500000"
  )
  .action((opts) => {
    main(opts).catch((err) => {
      console.error("Unhandled error:", err);
      process.exit(1);
    });
  });