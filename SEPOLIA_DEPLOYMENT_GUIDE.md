# 🚀 Complete Sepolia Deployment Guide - Auction & NFT Contracts

## 🎯 **Complete Process for Sepolia Testnet Deployment**

This guide covers the entire process to deploy and run your IdeaProof Auction and NFT contracts on ETH Sepolia testnet for your Universal app.

---

## 📋 **Prerequisites Setup**

### **1. Environment Configuration**
```bash
# Create .env file
cp .env.example .env

# Add your configuration to .env:
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### **2. Get Sepolia ETH**
```bash
# Visit Sepolia faucet
# URL: https://sepoliafaucet.com/
# Amount needed: ~0.2 ETH for deployment + testing
```

### **3. Setup Infura/Alchemy RPC**
```bash
# Get free RPC endpoint:
# Infura: https://infura.io/
# Alchemy: https://alchemy.com/
# Add to SEPOLIA_RPC_URL in .env
```

---

## 🚀 **Deployment Process**

### **Step 1: Compile Contracts** (1 minute)
```bash
# Compile all contracts
npx hardhat compile

# Verify compilation
ls artifacts/contracts/
```

### **Step 2: Deploy to Sepolia** (3 minutes)
```bash
# Deploy Auction and NFT contracts
npm run deploy:sepolia

# Expected output:
# ✅ IdeaProofNFT deployed to: 0x...
# ✅ IdeaProofAuction deployed to: 0x...
# 📄 Deployment info saved to: sepolia-deployment.json
```

### **Step 3: Setup Test Environment** (2 minutes)
```bash
# Create test idea and configure environment
npm run setup:sepolia:e2e

# Expected output:
# ✅ Test idea created
# 🎨 Frontend configuration updated
```

### **Step 4: Verify Contracts** (2 minutes)
```bash
# Verify on Etherscan (optional but recommended)
npm run verify:sepolia CONTRACT_ADDRESS

# Or use the commands from deployment output
```

---

## 🎮 **Your E2E Test Execution**

### **Phase 1: Frontend Setup** (2 minutes)
```bash
# Start frontend application
cd frontend
npm run dev

# Open http://localhost:5173
```

### **Phase 2: MetaMask Configuration** (3 minutes)

#### **Add Sepolia Network to MetaMask:**
```javascript
Network Name: Sepolia Testnet
RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io/
```

#### **Import Test Account:**
- Use your private key from .env
- Or create new account and get Sepolia ETH

### **Phase 3: Execute Auction Test** (10 minutes)

#### **1. Mock Bidding Users** ✅ (Setup)
- Create multiple test accounts
- Fund with Sepolia ETH
- Place initial bids: 0.11, 0.12, 0.13 ETH

#### **2. Your Higher Bid** 🎯 (Execute)
- Connect your MetaMask to Sepolia
- Navigate to test idea: "AI-Powered Smart Home Assistant"
- Place winning bid: **0.15 ETH**
- Confirm transaction

#### **3. Auction Completion** 🏆 (Wait/Execute)
- Wait for auction to end (or end manually if testing)
- Winner determined automatically
- NFT minting process begins

#### **4. NFT Minting & Transfer** 🎨 (Automatic)
- Smart contract mints NFT with:
  - Idea metadata
  - Winning bid amount
  - Random proof hash
  - Timestamp
- NFT transferred to winner's address

#### **5. Verification** ✅ (Check)
- Check NFT in MetaMask
- View on Etherscan
- Verify metadata and ownership

---

## 📊 **Expected Results**

### **Deployment Success Indicators:**
```
✅ IdeaProofNFT deployed: 0x...
✅ IdeaProofAuction deployed: 0x...
✅ Ownership transferred
✅ Test idea created
✅ Frontend configured
```

### **E2E Test Success:**
```
✅ Bids placed successfully
✅ Auction completed
✅ NFT minted with correct metadata
✅ NFT transferred to winner
✅ All transactions on Sepolia Etherscan
```

### **Timeline:**
```
0:00 - Start deployment
0:03 - Contracts deployed
0:05 - Test environment ready
0:07 - Frontend connected
0:10 - Bids placed
0:15 - Auction completed
0:17 - NFT minted and transferred
```

---

## 🔧 **Contract Interaction**

### **Key Contract Functions:**

#### **IdeaProofAuction:**
```solidity
// Create new idea
createIdea(title, description, category, reservePrice, duration)

// Place bid
placeBid(ideaId, amount)

// End auction
endAuction(ideaId)

// Get idea details
getIdea(ideaId)
```

#### **IdeaProofNFT:**
```solidity
// Mint NFT (only auction contract)
mintIdeaProof(to, title, description, winningBid, category, tokenURI)

// Get NFT details
getIdeaProof(tokenId)

// Standard ERC721 functions
ownerOf(tokenId), tokenURI(tokenId), etc.
```

---

## 🌐 **Network Information**

### **Sepolia Testnet Details:**
```
Chain ID: 11155111
RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
Block Explorer: https://sepolia.etherscan.io/
Faucet: https://sepoliafaucet.com/
Gas Price: ~20 gwei
Block Time: ~12 seconds
```

### **Contract Addresses (After Deployment):**
```
IdeaProofNFT: [Will be in sepolia-deployment.json]
IdeaProofAuction: [Will be in sepolia-deployment.json]
```

---

## 🔍 **Monitoring & Debugging**

### **Check Deployment Status:**
```bash
# View deployment info
cat sepolia-deployment.json

# Check contract on Etherscan
# Use URLs from deployment output
```

### **Test Contract Functions:**
```bash
# Open Hardhat console
npx hardhat console --network sepolia

# Interact with contracts
const auction = await ethers.getContractAt("IdeaProofAuction", "CONTRACT_ADDRESS");
await auction.getIdeaCount();
```

### **Frontend Integration:**
```javascript
// Contract addresses available in:
import { SEPOLIA_CONTRACTS } from './config/sepolia';

// Test data available in:
import { SEPOLIA_TEST_DATA } from './config/sepoliaTestData';
```

---

## ⚠️ **Troubleshooting**

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| Deployment fails | Check private key and Sepolia ETH balance |
| High gas fees | Adjust gas price in hardhat config |
| Transaction stuck | Increase gas price and retry |
| Contract verification fails | Check constructor parameters |
| Frontend not connecting | Verify MetaMask network settings |

### **Debug Commands:**
```bash
# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia

# Verify deployment
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Test contract interaction
npx hardhat console --network sepolia
```

---

## 📝 **Complete Command Reference**

### **Setup & Deployment:**
```bash
npm install                    # Install dependencies
npm run deploy:sepolia        # Deploy contracts
npm run setup:sepolia:e2e     # Setup test environment
npm run test:sepolia:prepare  # Deploy + setup combined
```

### **Verification:**
```bash
npm run verify:sepolia CONTRACT_ADDRESS
```

### **Frontend:**
```bash
cd frontend && npm run dev    # Start frontend
```

### **Testing:**
```bash
npx hardhat test --network sepolia
npx hardhat console --network sepolia
```

---

## 🎯 **Success Checklist**

### **Deployment Phase:**
- [ ] Environment variables configured
- [ ] Sepolia ETH obtained (~0.2 ETH)
- [ ] Contracts compiled successfully
- [ ] IdeaProofNFT deployed
- [ ] IdeaProofAuction deployed
- [ ] Ownership transferred
- [ ] Contracts verified on Etherscan

### **Testing Phase:**
- [ ] Frontend connected to Sepolia
- [ ] MetaMask configured
- [ ] Test idea created
- [ ] Bids placed successfully
- [ ] Auction completed
- [ ] NFT minted and transferred
- [ ] All transactions confirmed

---

## 🎉 **Ready to Execute**

**Your Sepolia deployment is ready! Execute with:**

```bash
# Complete setup and deployment
npm run test:sepolia:prepare

# Start frontend
cd frontend && npm run dev
```

**Expected total time:** ~15 minutes from start to working auction on Sepolia

**Next:** Execute the deployment and start your E2E testing on Sepolia testnet!