# ZetaChain Auction System - Deployment Guide

## Quick Start

### Prerequisites
```bash
# Install dependencies
cd example-app/auction
yarn install

# Install Foundry (for contract compilation and testing)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Testing on Localnet

1. **Start ZetaChain Localnet:**
```bash
# Make sure you have ZetaChain CLI installed
yarn global add @zetachain/toolkit

# Run the complete test suite
./scripts/localnet.sh
```

This will automatically:
- Deploy the auction contract
- Create a test auction
- Simulate bidding
- End auction and mint NFT
- Test cross-chain functionality

### Testing on Testnet

1. **Set up environment:**
```bash
export PRIVATE_KEY="your_private_key_here"
export CENTRAL_DEPOSIT="your_central_deposit_address"
```

2. **Deploy to ZetaChain Athens Testnet:**
```bash
npx ts-node commands/index.ts deploy \
  --private-key $PRIVATE_KEY \
  --rpc https://zetachain-athens-evm.blockpi.network/v1/rpc/public \
  --gateway 0x6c533f7fe93fae114d0954697069df33c9b74fd7 \
  --central-deposit $CENTRAL_DEPOSIT
```

3. **Create your first auction:**
```bash
export CONTRACT_ADDRESS="deployed_contract_address_from_step_2"

npx ts-node commands/index.ts auction create \
  --contract $CONTRACT_ADDRESS \
  --private-key $PRIVATE_KEY \
  --name "My First NFT" \
  --description "A unique digital collectible" \
  --image-uri "https://your-image-url.com/image.jpg" \
  --starting-bid "0.01" \
  --duration "1440"  # 24 hours
```

## Frontend Integration

### Option 1: Standalone React App

Create a new React app and integrate the auction component:

```bash
npx create-react-app my-auction-app --template typescript
cd my-auction-app

# Copy the auction component
cp ../example-app/auction/frontend/AuctionApp.tsx src/

# Install dependencies
npm install ethers @zetachain/toolkit
```

Add to your `App.tsx`:
```tsx
import AuctionApp from './AuctionApp';

function App() {
  return (
    <div className="App">
      <AuctionApp 
        contractAddress="YOUR_CONTRACT_ADDRESS"
        rpcUrl="https://zetachain-athens-evm.blockpi.network/v1/rpc/public"
      />
    </div>
  );
}
```

### Option 2: Integration with Existing ZetaChain Frontend

If you're using the existing frontend in this repository:

1. **Copy the component:**
```bash
cp example-app/auction/frontend/AuctionApp.tsx frontend/src/components/
```

2. **Add to your main app:**
```tsx
import AuctionApp from './components/AuctionApp';

// In your main component
<AuctionApp contractAddress="YOUR_CONTRACT_ADDRESS" />
```

## Manual Testing Steps

### 1. Deploy Contract
```bash
npx ts-node commands/index.ts deploy \
  --private-key YOUR_PRIVATE_KEY \
  --central-deposit YOUR_DEPOSIT_ADDRESS
```

### 2. Create Auction
```bash
npx ts-node commands/index.ts auction create \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --name "Digital Art Piece" \
  --description "Unique digital artwork" \
  --image-uri "https://example.com/art.jpg" \
  --starting-bid "0.1" \
  --duration "60"
```

### 3. User Deposits Funds
```bash
npx ts-node commands/index.ts auction deposit \
  --contract CONTRACT_ADDRESS \
  --private-key BIDDER_PRIVATE_KEY \
  --amount "1.0"
```

### 4. User Places Bid
```bash
npx ts-node commands/index.ts auction bid \
  --contract CONTRACT_ADDRESS \
  --private-key BIDDER_PRIVATE_KEY \
  --auction-id "1" \
  --amount "0.5"
```

### 5. End Auction (after time expires)
```bash
npx ts-node commands/index.ts auction end \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --auction-id "1"
```

### 6. Mint NFT to Winner
```bash
npx ts-node commands/index.ts auction mint \
  --contract CONTRACT_ADDRESS \
  --private-key YOUR_PRIVATE_KEY \
  --auction-id "1"
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors:**
   - Run `yarn install` in the auction directory
   - Make sure all dependencies are installed

2. **"Insufficient funds" errors:**
   - Ensure your wallet has enough ETH for gas fees
   - Check that users have deposited enough funds to the contract

3. **"Auction has ended" errors:**
   - Check auction end time with `auction list` command
   - Cannot bid on expired auctions

4. **Localnet connection issues:**
   - Ensure ZetaChain localnet is running
   - Check that ports 8545, 8546 are available
   - Try restarting localnet with `--force-kill`

### Network Configurations

**Localnet:**
- RPC: `http://localhost:8545`
- Chain ID: `31337`

**Athens Testnet:**
- RPC: `https://zetachain-athens-evm.blockpi.network/v1/rpc/public`
- Chain ID: `7001`
- Gateway: `0x6c533f7fe93fae114d0954697069df33c9b74fd7`

### Getting Testnet Funds

1. Visit ZetaChain Athens faucet
2. Connect your wallet
3. Request test ZETA tokens

## Security Considerations

1. **Private Keys:** Never commit private keys to version control
2. **Central Deposit:** Use a secure, monitored address for the central deposit
3. **Access Control:** Only contract owner can create auctions and mint NFTs
4. **Reentrancy:** Contract includes reentrancy protection
5. **Pausable:** Emergency pause functionality available

## Production Deployment

For production deployment:

1. **Audit the contract** before mainnet deployment
2. **Set up monitoring** for the central deposit address
3. **Configure proper access controls** for auction creation
4. **Test thoroughly** on testnet first
5. **Consider upgradeability** patterns for future improvements

## Support

- ZetaChain Documentation: https://www.zetachain.com/docs/
- ZetaChain Discord: https://discord.gg/zetachain
- GitHub Issues: Create an issue in this repository