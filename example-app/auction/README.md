# ZetaChain Universal Auction System

A decentralized auction system built on ZetaChain that allows users to bid on items using their connected wallets and automatically issues NFTs to successful bidders.

## Features

- **Wallet Integration**: Seamless MetaMask wallet connection
- **Deposit System**: Users deposit funds to a central address supported by ZetaChain
- **Auction Bidding**: Real-time bidding on auction items
- **NFT Rewards**: Automatic NFT minting for auction winners
- **Cross-Chain Support**: Built on ZetaChain for universal blockchain interoperability

## Architecture

### Smart Contract (`Auction.sol`)
- **ERC721 NFT Contract**: Issues unique NFTs to auction winners
- **Deposit Management**: Handles user deposits to central address
- **Auction Logic**: Manages auction creation, bidding, and completion
- **Security Features**: ReentrancyGuard, access controls, and pausable functionality

### Frontend Integration
- **React Component**: `AuctionApp.tsx` for wallet integration and bidding interface
- **Wallet Provider**: Uses existing ZetaChain wallet infrastructure
- **Real-time Updates**: Live auction status and bidding updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager
- Foundry for smart contract development

### Installation

1. **Install dependencies:**
```bash
cd example-app/auction
yarn install
```

2. **Build contracts:**
```bash
forge build
```

3. **Run tests:**
```bash
forge test
```

## Testing

### Localnet Testing

Run the complete auction system test on ZetaChain localnet:

```bash
chmod +x scripts/localnet.sh
./scripts/localnet.sh
```

This script will:
1. Start ZetaChain localnet
2. Deploy the auction contract
3. Create a test auction
4. Simulate bidding process
5. End auction and mint NFT to winner
6. Test cross-chain deposits

### Manual Testing

1. **Deploy contract:**
```bash
npx ts-node commands/index.ts deploy \
  --private-key YOUR_PRIVATE_KEY \
  --gateway GATEWAY_ADDRESS \
  --rpc RPC_URL \
  --central-deposit CENTRAL_DEPOSIT_ADDRESS
```

2. **Create auction:**
```bash
npx ts-node commands/index.ts auction create \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --name "Digital Artwork" \
  --description "Beautiful NFT artwork" \
  --image-uri "https://example.com/image.jpg" \
  --starting-bid "0.1" \
  --duration "60"
```

3. **Deposit funds:**
```bash
npx ts-node commands/index.ts auction deposit \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --amount "1.0"
```

4. **Place bid:**
```bash
npx ts-node commands/index.ts auction bid \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --auction-id "1" \
  --amount "0.5"
```

5. **End auction:**
```bash
npx ts-node commands/index.ts auction end \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --auction-id "1"
```

6. **Mint NFT to winner:**
```bash
npx ts-node commands/index.ts auction mint \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --auction-id "1"
```

### Testnet Deployment

For testnet deployment, use the ZetaChain Athens testnet:

```bash
npx ts-node commands/index.ts deploy \
  --private-key YOUR_PRIVATE_KEY \
  --rpc https://zetachain-athens-evm.blockpi.network/v1/rpc/public \
  --gateway 0x6c533f7fe93fae114d0954697069df33c9b74fd7
```

## Frontend Integration

To integrate the auction system into your frontend application:

1. **Import the component:**
```tsx
import AuctionApp from './example-app/auction/frontend/AuctionApp';
```

2. **Use in your app:**
```tsx
function App() {
  return (
    <WalletProvider>
      <AuctionApp 
        contractAddress="YOUR_DEPLOYED_CONTRACT_ADDRESS"
        rpcUrl="https://zetachain-athens-evm.blockpi.network/v1/rpc/public"
      />
    </WalletProvider>
  );
}
```

## Contract Functions

### User Functions
- `deposit()`: Deposit ETH to participate in auctions
- `placeBid(auctionId, bidAmount)`: Place a bid on an auction
- `withdraw(amount)`: Withdraw available funds
- `getAvailableBalance(user)`: Check available balance for bidding

### Owner Functions
- `createAuction(name, description, imageUri, startingBid, duration)`: Create new auction
- `endAuction(auctionId)`: End an auction
- `mintNFTToWinner(auctionId)`: Mint NFT to auction winner
- `setCentralDepositAddress(address)`: Update central deposit address

### View Functions
- `getAuction(auctionId)`: Get auction details
- `getActiveAuctions()`: Get list of active auction IDs
- `getAuctionBids(auctionId)`: Get bid history for an auction

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions for auction management
- **Pausable**: Emergency pause functionality
- **Deposit Validation**: Ensures sufficient funds before bidding
- **Time Validation**: Prevents bidding on expired auctions

## Network Configuration

### Localnet
- RPC: `http://localhost:8545`
- Chain ID: `31337`

### Testnet (Athens)
- RPC: `https://zetachain-athens-evm.blockpi.network/v1/rpc/public`
- Chain ID: `7001`
- Gateway: `0x6c533f7fe93fae114d0954697069df33c9b74fd7`

## Troubleshooting

### Common Issues

1. **"Insufficient deposit balance"**: User needs to deposit more funds
2. **"Auction has ended"**: Cannot bid on expired auctions
3. **"Bid must be higher than current bid"**: Bid amount too low
4. **"Transfer to central deposit failed"**: Check central deposit address

### Testing Issues

If localnet tests fail:
1. Ensure ZetaChain CLI is installed: `yarn global add @zetachain/toolkit`
2. Check if ports 8545, 8546 are available
3. Try restarting with `--force-kill` flag

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
- Check the [ZetaChain Documentation](https://www.zetachain.com/docs/)
- Open an issue in this repository
- Join the ZetaChain Discord community