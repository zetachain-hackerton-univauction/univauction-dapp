# 🚀 **EXECUTE SEPOLIA DEPLOYMENT - STEP BY STEP**

## ⚠️ **IMPORTANT: Run These Commands Locally**

Since Node.js is not available in this environment, you need to execute these commands on your local machine where you have Node.js and npm installed.

---

## 📋 **PRE-EXECUTION CHECKLIST**

### **1. Environment Setup** ✅ Ready
```bash
# Your .env file is already created
# You need to update it with your actual values:

PRIVATE_KEY=your_actual_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### **2. Get Required Resources** 🔗
- **Sepolia ETH**: https://sepoliafaucet.com/ (Get ~0.2 ETH)
- **Infura RPC**: https://infura.io/ (Free account)
- **Etherscan API**: https://etherscan.io/apis (Free account)

---

## 🚀 **EXECUTION COMMANDS**

### **Step 1: Install Dependencies**
```bash
# In your project directory
npm install
```

### **Step 2: Update Environment**
```bash
# Edit .env file with your actual values
nano .env
# or
code .env
```

### **Step 3: Compile Contracts**
```bash
# Compile all contracts
npx hardhat compile
```

### **Step 4: Deploy to Sepolia** 🎯
```bash
# Execute complete deployment and setup
npm run test:sepolia:prepare
```

**Expected Output:**
```
🚀 Deploying IdeaProof Auction to Sepolia Testnet...
Deploying with account: 0x...
Account balance: 0.2 ETH

📝 Deploying IdeaProofNFT...
✅ IdeaProofNFT deployed to: 0x...

🏛️ Deploying IdeaProofAuction...
✅ IdeaProofAuction deployed to: 0x...

🔗 Setting up permissions...
✅ NFT ownership transferred to auction contract

🧪 Setting up Sepolia E2E Test Environment...
📝 Creating test idea for auction...
✅ Test idea created with transaction: 0x...

🎉 Sepolia Deployment Complete!
📄 Deployment info saved to: sepolia-deployment.json
```

### **Step 5: Verify Contracts** (Optional)
```bash
# Verify contracts on Etherscan
npm run verify:sepolia
```

### **Step 6: Start Frontend**
```bash
# Start the frontend application
cd frontend
npm run dev

# Open http://localhost:5173
```

---

## 📊 **WHAT HAPPENS DURING DEPLOYMENT**

### **Contracts Deployed:**
1. **IdeaProofNFT** - NFT contract for minting proof tokens
2. **IdeaProofAuction** - Main auction contract with bidding logic

### **Test Environment Setup:**
1. **Test Idea Created**: "AI-Powered Smart Home Assistant"
2. **Reserve Price**: 0.1 ETH
3. **Duration**: 7 days
4. **Frontend Configuration**: Auto-updated with contract addresses

### **Files Created:**
- `sepolia-deployment.json` - Contract addresses and deployment info
- `frontend/src/config/sepolia.ts` - Frontend configuration
- `frontend/src/config/sepoliaTestData.ts` - Test data

---

## 🎮 **AFTER DEPLOYMENT - E2E TEST**

### **Phase 1: Setup Multiple Accounts**
1. Create 3-4 MetaMask accounts
2. Fund each with 0.1-0.2 Sepolia ETH
3. Connect to Sepolia testnet

### **Phase 2: Mock Bidding**
1. Account 1: Bid 0.11 ETH
2. Account 2: Bid 0.12 ETH  
3. Account 3: Bid 0.13 ETH

### **Phase 3: Your Winning Bid**
1. Use your main account
2. Bid 0.15 ETH (higher than others)
3. Win the auction

### **Phase 4: NFT Minting**
1. Auction ends (manually or wait)
2. NFT automatically minted
3. NFT transferred to winner
4. Check in MetaMask

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**
| Issue | Solution |
|-------|----------|
| "Insufficient funds" | Get more Sepolia ETH from faucet |
| "Invalid private key" | Check .env file format |
| "Network error" | Verify Infura RPC URL |
| "Gas estimation failed" | Increase gas limit |

### **Debug Commands:**
```bash
# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia

# Test contract interaction
npx hardhat console --network sepolia

# View deployment info
cat sepolia-deployment.json
```

---

## 🎯 **SUCCESS INDICATORS**

### **Deployment Success:**
- ✅ Two contract addresses in sepolia-deployment.json
- ✅ Contracts visible on Sepolia Etherscan
- ✅ Test idea created successfully
- ✅ Frontend connects to contracts

### **E2E Test Success:**
- ✅ Multiple bids placed successfully
- ✅ Auction completed with winner
- ✅ NFT minted and transferred
- ✅ NFT visible in MetaMask

---

## 🚀 **READY TO EXECUTE**

**Your deployment is fully prepared! Execute these commands on your local machine:**

```bash
# 1. Update .env with your values
# 2. Install dependencies: npm install
# 3. Deploy: npm run test:sepolia:prepare
# 4. Start frontend: cd frontend && npm run dev
# 5. Test the complete auction flow
```

**Expected total time:** ~15 minutes from start to deployed contracts
**Expected gas cost:** ~0.05-0.1 ETH for deployment
**Result:** Working auction system on Sepolia testnet

---

**🎉 Everything is ready for your Sepolia deployment execution!**