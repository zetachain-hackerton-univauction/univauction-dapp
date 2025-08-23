import { Command } from "commander";
import { ethers } from "ethers";
import { getAbi } from "./common";

const createAuction = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, signer);

    const duration = parseInt(opts.duration) * 60; // Convert minutes to seconds
    const startingBid = ethers.utils.parseEther(opts.startingBid);

    const tx = await contract.createAuction(
      opts.name,
      opts.description,
      opts.imageUri,
      startingBid,
      duration
    );

    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === "AuctionCreated");
    
    console.log(
      JSON.stringify({
        success: true,
        auctionId: event?.args?.auctionId?.toString(),
        transactionHash: tx.hash,
        name: opts.name,
        startingBid: opts.startingBid,
        duration: opts.duration + " minutes",
      })
    );
  } catch (err) {
    console.error("Create auction failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

const placeBid = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, signer);

    const bidAmount = ethers.utils.parseEther(opts.amount);

    const tx = await contract.placeBid(opts.auctionId, bidAmount);
    const receipt = await tx.wait();

    console.log(
      JSON.stringify({
        success: true,
        auctionId: opts.auctionId,
        bidAmount: opts.amount,
        transactionHash: tx.hash,
      })
    );
  } catch (err) {
    console.error("Place bid failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

const deposit = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, signer);

    const amount = ethers.utils.parseEther(opts.amount);

    const tx = await contract.deposit({ value: amount });
    const receipt = await tx.wait();

    console.log(
      JSON.stringify({
        success: true,
        depositor: signer.address,
        amount: opts.amount,
        transactionHash: tx.hash,
      })
    );
  } catch (err) {
    console.error("Deposit failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

const endAuction = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, signer);

    const tx = await contract.endAuction(opts.auctionId);
    const receipt = await tx.wait();

    console.log(
      JSON.stringify({
        success: true,
        auctionId: opts.auctionId,
        transactionHash: tx.hash,
      })
    );
  } catch (err) {
    console.error("End auction failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

const mintNFT = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
  const signer = new ethers.Wallet(opts.privateKey, provider);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, signer);

    const tx = await contract.mintNFTToWinner(opts.auctionId);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e: any) => e.event === "NFTMinted");

    console.log(
      JSON.stringify({
        success: true,
        auctionId: opts.auctionId,
        winner: event?.args?.winner,
        tokenId: event?.args?.tokenId?.toString(),
        transactionHash: tx.hash,
      })
    );
  } catch (err) {
    console.error("Mint NFT failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

const getAuctions = async (opts: any) => {
  const provider = new ethers.providers.JsonRpcProvider(opts.rpc);

  try {
    const { abi } = getAbi("Auction");
    const contract = new ethers.Contract(opts.contract, abi, provider);

    const activeAuctions = await contract.getActiveAuctions();
    const auctions = [];

    for (const auctionId of activeAuctions) {
      const auction = await contract.getAuction(auctionId);
      auctions.push({
        auctionId: auctionId.toString(),
        name: auction.name,
        description: auction.description,
        currentBid: ethers.utils.formatEther(auction.currentBid),
        currentBidder: auction.currentBidder,
        endTime: new Date(auction.endTime * 1000).toISOString(),
        isActive: auction.isActive,
      });
    }

    console.log(JSON.stringify({ auctions }, null, 2));
  } catch (err) {
    console.error("Get auctions failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

export const auction = new Command("auction")
  .description("Auction operations");

auction
  .command("create")
  .description("Create a new auction")
  .requiredOption("-c, --contract <address>", "Contract address")
  .requiredOption("-k, --private-key <key>", "Private key")
  .requiredOption("-n, --name <name>", "Auction item name")
  .requiredOption("-d, --description <desc>", "Auction item description")
  .requiredOption("-i, --image-uri <uri>", "Image URI")
  .requiredOption("-s, --starting-bid <amount>", "Starting bid in ETH")
  .requiredOption("-t, --duration <minutes>", "Duration in minutes")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(createAuction);

auction
  .command("bid")
  .description("Place a bid on an auction")
  .requiredOption("-c, --contract <address>", "Contract address")
  .requiredOption("-k, --private-key <key>", "Private key")
  .requiredOption("-a, --auction-id <id>", "Auction ID")
  .requiredOption("-m, --amount <amount>", "Bid amount in ETH")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(placeBid);

auction
  .command("deposit")
  .description("Deposit funds to the auction contract")
  .requiredOption("-c, --contract <address>", "Contract address")
  .requiredOption("-k, --private-key <key>", "Private key")
  .requiredOption("-a, --amount <amount>", "Deposit amount in ETH")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(deposit);

auction
  .command("end")
  .description("End an auction")
  .requiredOption("-c, --contract <address>", "Contract address")
  .requiredOption("-k, --private-key <key>", "Private key")
  .requiredOption("-a, --auction-id <id>", "Auction ID")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(endAuction);

auction
  .command("mint")
  .description("Mint NFT to auction winner")
  .requiredOption("-c, --contract <address>", "Contract address")
  .requiredOption("-k, --private-key <key>", "Private key")
  .requiredOption("-a, --auction-id <id>", "Auction ID")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(mintNFT);

auction
  .command("list")
  .description("List active auctions")
  .requiredOption("-c, --contract <address>", "Contract address")
  .option("-r, --rpc <url>", "RPC URL", "https://zetachain-athens-evm.blockpi.network/v1/rpc/public")
  .action(getAuctions);