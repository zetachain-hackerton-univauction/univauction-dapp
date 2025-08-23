// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../contracts/Auction.sol";

contract AuctionTest is Test {
    Auction public auction;
    address public owner;
    address public centralDeposit;
    address public bidder1;
    address public bidder2;
    address public gateway;
    
    uint256 constant INITIAL_BALANCE = 10 ether;
    
    function setUp() public {
        owner = address(this);
        centralDeposit = makeAddr("centralDeposit");
        bidder1 = makeAddr("bidder1");
        bidder2 = makeAddr("bidder2");
        gateway = makeAddr("gateway");
        
        // Deploy auction contract
        auction = new Auction();
        
        // Initialize the contract
        auction.initialize(
            owner,
            "Test Auction NFT",
            "TANFT",
            payable(gateway),
            500000,
            address(0), // uniswap router
            centralDeposit
        );
        
        // Fund test accounts
        vm.deal(bidder1, INITIAL_BALANCE);
        vm.deal(bidder2, INITIAL_BALANCE);
        vm.deal(centralDeposit, INITIAL_BALANCE);
    }
    
    function testCreateAuction() public {
        uint256 startingBid = 1 ether;
        uint256 duration = 3600; // 1 hour
        
        vm.expectEmit(true, false, false, true);
        emit Auction.AuctionCreated(1, "Test Item", startingBid, block.timestamp + duration);
        
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        Auction.AuctionItem memory auctionItem = auction.getAuction(1);
        assertEq(auctionItem.name, "Test Item");
        assertEq(auctionItem.startingBid, startingBid);
        assertEq(auctionItem.currentBid, startingBid);
        assertTrue(auctionItem.isActive);
    }
    
    function testDeposit() public {
        uint256 depositAmount = 2 ether;
        
        vm.startPrank(bidder1);
        
        uint256 centralDepositBalanceBefore = centralDeposit.balance;
        
        vm.expectEmit(true, false, false, true);
        emit Auction.DepositMade(bidder1, depositAmount);
        
        auction.deposit{value: depositAmount}();
        
        assertEq(auction.userDeposits(bidder1), depositAmount);
        assertEq(centralDeposit.balance, centralDepositBalanceBefore + depositAmount);
        
        vm.stopPrank();
    }
    
    function testPlaceBid() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Bidder deposits funds
        uint256 depositAmount = 3 ether;
        vm.prank(bidder1);
        auction.deposit{value: depositAmount}();
        
        // Place bid
        uint256 bidAmount = 2 ether;
        vm.startPrank(bidder1);
        
        vm.expectEmit(true, true, false, true);
        emit Auction.BidPlaced(1, bidder1, bidAmount, block.timestamp);
        
        auction.placeBid(1, bidAmount);
        
        Auction.AuctionItem memory auctionItem = auction.getAuction(1);
        assertEq(auctionItem.currentBid, bidAmount);
        assertEq(auctionItem.currentBidder, bidder1);
        
        vm.stopPrank();
    }
    
    function testMultipleBids() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Both bidders deposit funds
        vm.prank(bidder1);
        auction.deposit{value: 3 ether}();
        
        vm.prank(bidder2);
        auction.deposit{value: 4 ether}();
        
        // First bid
        vm.prank(bidder1);
        auction.placeBid(1, 2 ether);
        
        // Second bid (higher)
        vm.prank(bidder2);
        auction.placeBid(1, 3 ether);
        
        Auction.AuctionItem memory auctionItem = auction.getAuction(1);
        assertEq(auctionItem.currentBid, 3 ether);
        assertEq(auctionItem.currentBidder, bidder2);
    }
    
    function testEndAuction() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Bidder deposits and bids
        vm.prank(bidder1);
        auction.deposit{value: 3 ether}();
        
        vm.prank(bidder1);
        auction.placeBid(1, 2 ether);
        
        // Fast forward time to end auction
        vm.warp(block.timestamp + duration + 1);
        
        vm.expectEmit(true, true, false, true);
        emit Auction.AuctionEnded(1, bidder1, 2 ether);
        
        auction.endAuction(1);
        
        Auction.AuctionItem memory auctionItem = auction.getAuction(1);
        assertFalse(auctionItem.isActive);
        
        // Check that winning bid was deducted from bidder's deposit
        assertEq(auction.userDeposits(bidder1), 1 ether); // 3 - 2 = 1
    }
    
    function testMintNFTToWinner() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Bidder deposits and bids
        vm.prank(bidder1);
        auction.deposit{value: 3 ether}();
        
        vm.prank(bidder1);
        auction.placeBid(1, 2 ether);
        
        // End auction
        vm.warp(block.timestamp + duration + 1);
        auction.endAuction(1);
        
        // Mint NFT
        vm.expectEmit(true, true, false, false);
        emit Auction.NFTMinted(1, bidder1, 0); // tokenId will be generated
        
        auction.mintNFTToWinner(1);
        
        // Check NFT was minted to winner
        assertEq(auction.balanceOf(bidder1), 1);
        
        Auction.AuctionItem memory auctionItem = auction.getAuction(1);
        assertTrue(auctionItem.nftMinted);
    }
    
    function testWithdraw() public {
        uint256 depositAmount = 2 ether;
        
        // Deposit funds
        vm.prank(bidder1);
        auction.deposit{value: depositAmount}();
        
        // Withdraw some funds
        uint256 withdrawAmount = 1 ether;
        uint256 balanceBefore = bidder1.balance;
        
        vm.startPrank(bidder1);
        
        vm.expectEmit(true, false, false, true);
        emit Auction.WithdrawalMade(bidder1, withdrawAmount);
        
        auction.withdraw(withdrawAmount);
        
        assertEq(bidder1.balance, balanceBefore + withdrawAmount);
        assertEq(auction.userDeposits(bidder1), depositAmount - withdrawAmount);
        
        vm.stopPrank();
    }
    
    function testGetAvailableBalance() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Bidder deposits funds
        uint256 depositAmount = 5 ether;
        vm.prank(bidder1);
        auction.deposit{value: depositAmount}();
        
        // Initially, all deposited funds are available
        assertEq(auction.getAvailableBalance(bidder1), depositAmount);
        
        // Place bid
        uint256 bidAmount = 3 ether;
        vm.prank(bidder1);
        auction.placeBid(1, bidAmount);
        
        // Available balance should be reduced by bid amount
        assertEq(auction.getAvailableBalance(bidder1), depositAmount - bidAmount);
    }
    
    function testFailBidWithInsufficientDeposit() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Try to bid without sufficient deposit
        vm.prank(bidder1);
        auction.placeBid(1, 2 ether); // Should fail
    }
    
    function testFailBidOnExpiredAuction() public {
        // Create auction
        uint256 startingBid = 1 ether;
        uint256 duration = 3600;
        auction.createAuction(
            "Test Item",
            "A test auction item",
            "https://example.com/image.jpg",
            startingBid,
            duration
        );
        
        // Fast forward past auction end
        vm.warp(block.timestamp + duration + 1);
        
        // Deposit and try to bid
        vm.prank(bidder1);
        auction.deposit{value: 3 ether}();
        
        vm.prank(bidder1);
        auction.placeBid(1, 2 ether); // Should fail
    }
    
    function testGetActiveAuctions() public {
        // Create multiple auctions
        auction.createAuction("Item 1", "Description 1", "uri1", 1 ether, 3600);
        auction.createAuction("Item 2", "Description 2", "uri2", 2 ether, 7200);
        auction.createAuction("Item 3", "Description 3", "uri3", 3 ether, 1800);
        
        uint256[] memory activeAuctions = auction.getActiveAuctions();
        assertEq(activeAuctions.length, 3);
        assertEq(activeAuctions[0], 1);
        assertEq(activeAuctions[1], 2);
        assertEq(activeAuctions[2], 3);
        
        // End one auction
        vm.warp(block.timestamp + 1801); // Past auction 3's end time
        auction.endAuction(3);
        
        activeAuctions = auction.getActiveAuctions();
        assertEq(activeAuctions.length, 2);
    }
}