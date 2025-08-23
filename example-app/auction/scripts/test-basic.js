#!/usr/bin/env node

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Simple test script to verify contract compilation and basic functionality
async function testBasic() {
  console.log('🧪 Running basic auction system tests...\n');

  try {
    // Test 1: Check if contract artifacts exist
    console.log('1. Checking contract compilation...');
    const contractPath = path.join(__dirname, '..', 'out', 'Auction.sol', 'Auction.json');
    
    if (!fs.existsSync(contractPath)) {
      console.log('❌ Contract not compiled. Run: forge build');
      console.log('   If forge is not installed, install Foundry first:');
      console.log('   curl -L https://foundry.paradigm.xyz | bash && foundryup');
      return;
    }
    
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    console.log('✅ Contract compiled successfully');

    // Test 2: Validate ABI structure
    console.log('\n2. Validating contract ABI...');
    const abi = contractArtifact.abi;
    
    const requiredFunctions = [
      'initialize',
      'createAuction',
      'deposit',
      'placeBid',
      'endAuction',
      'mintNFTToWinner',
      'getActiveAuctions',
      'getAuction',
      'userDeposits',
      'getAvailableBalance'
    ];

    const abiMethods = abi.filter(item => item.type === 'function').map(item => item.name);
    
    for (const func of requiredFunctions) {
      if (abiMethods.includes(func)) {
        console.log(`✅ ${func} function found`);
      } else {
        console.log(`❌ ${func} function missing`);
      }
    }

    // Test 3: Check events
    console.log('\n3. Validating contract events...');
    const requiredEvents = [
      'AuctionCreated',
      'BidPlaced',
      'AuctionEnded',
      'NFTMinted',
      'DepositMade',
      'WithdrawalMade'
    ];

    const abiEvents = abi.filter(item => item.type === 'event').map(item => item.name);
    
    for (const event of requiredEvents) {
      if (abiEvents.includes(event)) {
        console.log(`✅ ${event} event found`);
      } else {
        console.log(`❌ ${event} event missing`);
      }
    }

    // Test 4: Check CLI commands
    console.log('\n4. Checking CLI commands...');
    const commandsPath = path.join(__dirname, '..', 'commands');
    const requiredCommands = ['deploy.ts', 'auction.ts', 'common.ts', 'index.ts'];
    
    for (const cmd of requiredCommands) {
      const cmdPath = path.join(commandsPath, cmd);
      if (fs.existsSync(cmdPath)) {
        console.log(`✅ ${cmd} command found`);
      } else {
        console.log(`❌ ${cmd} command missing`);
      }
    }

    // Test 5: Check frontend component
    console.log('\n5. Checking frontend component...');
    const frontendPath = path.join(__dirname, '..', 'frontend', 'AuctionApp.tsx');
    if (fs.existsSync(frontendPath)) {
      console.log('✅ AuctionApp.tsx component found');
    } else {
      console.log('❌ AuctionApp.tsx component missing');
    }

    console.log('\n🎉 Basic tests completed!');
    console.log('\nNext steps:');
    console.log('1. Run full tests: forge test');
    console.log('2. Test on localnet: ./scripts/localnet.sh');
    console.log('3. Deploy to testnet: see DEPLOYMENT_GUIDE.md');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you ran: yarn install');
    console.log('2. Compile contracts: forge build');
    console.log('3. Check file permissions');
  }
}

// Run the test
testBasic().catch(console.error);