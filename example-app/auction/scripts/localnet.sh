#!/bin/bash

set -e
set -x
set -o pipefail

echo "Starting ZetaChain Auction System Localnet Test..."

# Start localnet
yarn zetachain localnet start --force-kill --exit-on-error &

# Wait for registry file
while [ ! -f "$HOME/.zetachain/localnet/registry.json" ]; do sleep 1; done

# Build contracts
forge build

# Extract addresses and keys from registry
ZRC20_BNB=$(jq -r '.\"98\".chainInfo.gasZRC20' ~/.zetachain/localnet/registry.json) && echo "ZRC20_BNB: $ZRC20_BNB"
ZRC20_ETHEREUM=$(jq -r '.\"11155112\".chainInfo.gasZRC20' ~/.zetachain/localnet/registry.json) && echo "ZRC20_ETHEREUM: $ZRC20_ETHEREUM"
GATEWAY_ETHEREUM=$(jq -r '.[\"11155112\"].contracts[] | select(.contractType == \"gateway\") | .address' ~/.zetachain/localnet/registry.json) && echo "GATEWAY_ETHEREUM: $GATEWAY_ETHEREUM"
GATEWAY_BNB=$(jq -r '.\"98\".contracts[] | select(.contractType == \"gateway\") | .address' ~/.zetachain/localnet/registry.json) && echo "GATEWAY_BNB: $GATEWAY_BNB"
GATEWAY_ZETACHAIN=$(jq -r '.[\"31337\"].contracts[] | select(.contractType == \"gateway\") | .address' ~/.zetachain/localnet/registry.json) && echo "GATEWAY_ZETACHAIN: $GATEWAY_ZETACHAIN"
UNISWAP_ROUTER=$(jq -r '.[\"31337\"].contracts[] | select(.contractType == \"uniswapRouterInstance\") | .address' ~/.zetachain/localnet/registry.json) && echo "UNISWAP_ROUTER: $UNISWAP_ROUTER"
PRIVATE_KEY=$(jq -r '.private_keys[0]' ~/.zetachain/localnet/anvil.json) && echo "PRIVATE_KEY: $PRIVATE_KEY"
RECIPIENT=$(cast wallet address $PRIVATE_KEY) && echo "RECIPIENT: $RECIPIENT"
RPC=http://localhost:8545

echo "Deploying Auction contract..."

# Deploy auction contract
AUCTION_CONTRACT=$(npx ts-node commands/index.ts deploy \
  --private-key $PRIVATE_KEY \
  --gateway $GATEWAY_ZETACHAIN \
  --rpc $RPC \
  --uniswap-router $UNISWAP_ROUTER \
  --central-deposit $RECIPIENT | jq -r .contractAddress)

echo "Auction contract deployed at: $AUCTION_CONTRACT"

# Create a test auction
echo "Creating test auction..."
npx ts-node commands/index.ts auction create \
  --contract $AUCTION_CONTRACT \
  --private-key $PRIVATE_KEY \
  --rpc $RPC \
  --name "Test NFT Artwork" \
  --description "A beautiful digital artwork for auction" \
  --image-uri "https://example.com/artwork.jpg" \
  --starting-bid "0.1" \
  --duration "60"

echo "Test auction created!"

# Get a second private key for bidder
BIDDER_KEY=$(jq -r '.private_keys[1]' ~/.zetachain/localnet/anvil.json)
BIDDER_ADDRESS=$(cast wallet address $BIDDER_KEY)

echo "Bidder address: $BIDDER_ADDRESS"

# Fund bidder account
cast send --private-key $PRIVATE_KEY --value 5ether $BIDDER_ADDRESS --rpc-url $RPC

echo "Bidder funded with 5 ETH"

# Bidder deposits funds to auction contract
echo "Bidder depositing funds..."
npx ts-node commands/index.ts auction deposit \
  --contract $AUCTION_CONTRACT \
  --private-key $BIDDER_KEY \
  --rpc $RPC \
  --amount "1.0"

echo "Bidder deposited 1 ETH"

# Bidder places a bid
echo "Bidder placing bid..."
npx ts-node commands/index.ts auction bid \
  --contract $AUCTION_CONTRACT \
  --private-key $BIDDER_KEY \
  --rpc $RPC \
  --auction-id "1" \
  --amount "0.5"

echo "Bid placed!"

# List active auctions
echo "Listing active auctions..."
npx ts-node commands/index.ts auction list \
  --contract $AUCTION_CONTRACT \
  --rpc $RPC

# Wait for auction to end (60 seconds + buffer)
echo "Waiting for auction to end (65 seconds)..."
sleep 65

# End the auction
echo "Ending auction..."
npx ts-node commands/index.ts auction end \
  --contract $AUCTION_CONTRACT \
  --private-key $PRIVATE_KEY \
  --rpc $RPC \
  --auction-id "1"

echo "Auction ended!"

# Mint NFT to winner
echo "Minting NFT to winner..."
npx ts-node commands/index.ts auction mint \
  --contract $AUCTION_CONTRACT \
  --private-key $PRIVATE_KEY \
  --rpc $RPC \
  --auction-id "1"

echo "NFT minted to winner!"

# Check NFT balance of winner
echo "Checking NFT balance of winner..."
cast call $AUCTION_CONTRACT "balanceOf(address)" $BIDDER_ADDRESS --rpc-url $RPC

echo "✅ Auction system test completed successfully!"

# Test cross-chain deposit from Ethereum
echo "Testing cross-chain deposit from Ethereum..."

npx zetachain evm deposit-and-call \
  --rpc http://localhost:8545 \
  --chain-id 11155112 \
  --gateway $GATEWAY_ETHEREUM \
  --amount 0.001 \
  --types address uint256 \
  --receiver $AUCTION_CONTRACT \
  --private-key $PRIVATE_KEY \
  --values $BIDDER_ADDRESS 1000000000000000000 \
  --yes

echo "Cross-chain deposit test completed!"

yarn zetachain localnet check

echo "Stopping localnet..."
yarn zetachain localnet stop

echo "🎉 All tests passed! Auction system is working correctly."