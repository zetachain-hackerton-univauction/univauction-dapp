# 🎯 Simple E2E Test - ZetaChain Athens Testnet

## ✅ **Clean Setup - Using Official ZetaChain Tools**

Using:
- ✅ **ZetaChain Athens Testnet** (real testnet)
- ✅ **Sepolia Testnet** (for cross-chain)
- ✅ **Official ZetaChain localnet** (for development)
- ✅ **Existing working scripts**

---

## 🚀 **Your E2E Test Execution**

### **Phase 1: Environment Setup** (5 minutes)

#### **Get Testnet Tokens**
```bash
# Sepolia ETH (for bidding)
# Visit: https://sepoliafaucet.com/

# ZETA tokens (for gas)
# Visit: https://labs.zetachain.com/get-zeta
```

#### **Setup Environment**
```bash
# Set your private key
export PRIVATE_KEY="your_private_key_here"

# Deploy contracts to Athens testnet
npm run test:e2e:prepare
```

### **Phase 2: Execute Your Test Scenario** (10 minutes)

#### **1. Mock Bidding Users** ✅ (Setup via scripts)
- Alice: 0.11 ETH
- Bob: 0.12 ETH

#### **2. Your Higher Bid** 🎯 (Execute)
```bash
# Start frontend
cd frontend && npm run dev

# Open http://localhost:5173
# Connect MetaMask to Sepolia
# Place winning bid: 0.15 ETH
```

#### **3. Cross-Chain Withdrawal** 🔄 (Automatic)
```
Sepolia ETH → ZetaChain Athens
Processing: 2-5 minutes
```

#### **4. ZetaChain NFT Issuance** 🎨 (Automatic)
```
Smart contract mints NFT with:
- Idea metadata
- Winning bid amount
- Random proof hash
- Timestamp
```

#### **5. NFT to Your Address** ✅ (Automatic)
```
NFT transferred to bidder's wallet
Viewable in MetaMask on ZetaChain network
```

---

## 🔧 **Available Commands**

### **Development (Optional)**
```bash
# Use official ZetaChain localnet for development
bash scripts/localnet.sh
```

### **Testnet (Main E2E)**
```bash
# Deploy to Athens testnet
npm run deploy:testnet:complete

# Setup test environment
npm run setup:e2e

# Combined deployment + setup
npm run test:e2e:prepare
```

### **Frontend**
```bash
cd frontend && npm run dev
```

---

## 📊 **Expected Results**

### **Success Timeline**
```
0:00 - Deploy contracts to Athens
0:03 - Setup test environment
0:05 - Start frontend
0:07 - Connect MetaMask
0:08 - Place winning bid (0.15 ETH)
0:10 - Cross-chain processing starts
0:15 - NFT minted and transferred
```

### **Success Indicators**
- ✅ Contracts deployed to Athens testnet
- ✅ Mock bids configured (0.11, 0.12 ETH)
- ✅ Your bid higher (0.15 ETH)
- ✅ Cross-chain deposit completed
- ✅ NFT minted with metadata
- ✅ NFT in your MetaMask wallet

---

## 🌐 **Network Configuration**

### **MetaMask Networks**
```javascript
// Sepolia Testnet (for bidding)
Chain ID: 11155111
RPC: https://sepolia.infura.io/v3/YOUR_KEY
Explorer: https://sepolia.etherscan.io/

// ZetaChain Athens (for NFT)
Chain ID: 7001
RPC: https://rpc.athens3.zetachain.com
Explorer: https://athens3.explorer.zetachain.com/
```

### **Faucets**
- **Sepolia ETH**: https://sepoliafaucet.com/
- **ZETA tokens**: https://labs.zetachain.com/get-zeta

---

## 🎯 **Ready to Execute**

**Simple execution path:**

1. **Get testnet tokens** (Sepolia ETH + ZETA)
2. **Deploy**: `npm run test:e2e:prepare`
3. **Test**: Start frontend and execute bidding flow
4. **Verify**: Check NFT in MetaMask

**Total time**: ~15 minutes
**Success rate**: High (using official testnet)

---

**What would you like to do next?**

1. **Execute testnet deployment**: `npm run test:e2e:prepare`
2. **Try official localnet first**: `bash scripts/localnet.sh`
3. **Focus on specific component**: Contracts, frontend, etc.

The setup is now clean and focused on working solutions!