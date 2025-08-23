// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

// Import UniversalNFTCore for universal NFT functionality
import "@zetachain/standard-contracts/contracts/nft/contracts/zetachain/UniversalNFTCore.sol";

contract Auction is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721PausableUpgradeable,
    OwnableUpgradeable,
    ERC721BurnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable,
    UniversalNFTCore
{
    uint256 private _nextTokenId;
    address public centralDepositAddress;
    
    struct AuctionItem {
        uint256 auctionId;
        string name;
        string description;
        string imageUri;
        uint256 startingBid;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool isActive;
        bool nftMinted;
    }
    
    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(address => uint256) public userDeposits;
    mapping(uint256 => mapping(address => uint256)) public userBidsInAuction;
    
    uint256 public nextAuctionId;
    
    event AuctionCreated(
        uint256 indexed auctionId,
        string name,
        uint256 startingBid,
        uint256 endTime
    );
    
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        uint256 timestamp
    );
    
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 winningBid
    );
    
    event NFTMinted(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 tokenId
    );
    
    event DepositMade(
        address indexed user,
        uint256 amount
    );
    
    event WithdrawalMade(
        address indexed user,
        uint256 amount
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory name,
        string memory symbol,
        address payable gatewayAddress,
        uint256 gas,
        address uniswapRouterAddress,
        address _centralDepositAddress
    ) public initializer {
        __ERC721_init(name, symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Pausable_init();
        __Ownable_init(initialOwner);
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        __UniversalNFTCore_init(gatewayAddress, gas, uniswapRouterAddress);
        
        centralDepositAddress = _centralDepositAddress;
        nextAuctionId = 1;
    }

    function createAuction(
        string memory name,
        string memory description,
        string memory imageUri,
        uint256 startingBid,
        uint256 duration
    ) external onlyOwner {
        uint256 auctionId = nextAuctionId++;
        uint256 endTime = block.timestamp + duration;
        
        auctions[auctionId] = AuctionItem({
            auctionId: auctionId,
            name: name,
            description: description,
            imageUri: imageUri,
            startingBid: startingBid,
            currentBid: startingBid,
            currentBidder: address(0),
            endTime: endTime,
            isActive: true,
            nftMinted: false
        });
        
        emit AuctionCreated(auctionId, name, startingBid, endTime);
    }

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        userDeposits[msg.sender] += msg.value;
        
        // Transfer to central deposit address
        (bool success, ) = centralDepositAddress.call{value: msg.value}("");
        require(success, "Transfer to central deposit failed");
        
        emit DepositMade(msg.sender, msg.value);
    }

    function placeBid(uint256 auctionId, uint256 bidAmount) external nonReentrant {
        AuctionItem storage auction = auctions[auctionId];
        
        require(auction.isActive, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(bidAmount > auction.currentBid, "Bid must be higher than current bid");
        require(userDeposits[msg.sender] >= bidAmount, "Insufficient deposit balance");
        
        // Return previous bid amount to previous bidder's available balance
        if (auction.currentBidder != address(0)) {
            userBidsInAuction[auctionId][auction.currentBidder] = 0;
        }
        
        // Lock the bid amount
        userBidsInAuction[auctionId][msg.sender] = bidAmount;
        
        // Update auction
        auction.currentBid = bidAmount;
        auction.currentBidder = msg.sender;
        
        // Record bid
        auctionBids[auctionId].push(Bid({
            bidder: msg.sender,
            amount: bidAmount,
            timestamp: block.timestamp
        }));
        
        emit BidPlaced(auctionId, msg.sender, bidAmount, block.timestamp);
    }

    function endAuction(uint256 auctionId) external {
        AuctionItem storage auction = auctions[auctionId];
        
        require(auction.isActive, "Auction is not active");
        require(block.timestamp >= auction.endTime, "Auction has not ended yet");
        
        auction.isActive = false;
        
        if (auction.currentBidder != address(0)) {
            // Deduct winning bid from winner's deposit
            userDeposits[auction.currentBidder] -= auction.currentBid;
            userBidsInAuction[auctionId][auction.currentBidder] = 0;
            
            emit AuctionEnded(auctionId, auction.currentBidder, auction.currentBid);
        } else {
            emit AuctionEnded(auctionId, address(0), 0);
        }
    }

    function mintNFTToWinner(uint256 auctionId) external onlyOwner {
        AuctionItem storage auction = auctions[auctionId];
        
        require(!auction.isActive, "Auction is still active");
        require(!auction.nftMinted, "NFT already minted");
        require(auction.currentBidder != address(0), "No winner for this auction");
        
        // Generate unique token ID
        uint256 hash = uint256(
            keccak256(
                abi.encodePacked(address(this), block.number, _nextTokenId++, auctionId)
            )
        );
        uint256 tokenId = hash & 0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
        
        // Create metadata URI
        string memory tokenURI = string(abi.encodePacked(
            '{"name":"', auction.name, 
            '","description":"', auction.description,
            '","image":"', auction.imageUri,
            '","attributes":[{"trait_type":"Auction ID","value":"', _toString(auctionId),
            '"},{"trait_type":"Winning Bid","value":"', _toString(auction.currentBid), '"}]}'
        ));
        
        _safeMint(auction.currentBidder, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        auction.nftMinted = true;
        
        emit NFTMinted(auctionId, auction.currentBidder, tokenId);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(userDeposits[msg.sender] >= amount, "Insufficient balance");
        
        // Check that user doesn't have active bids that would make balance insufficient
        uint256 availableBalance = getAvailableBalance(msg.sender);
        require(availableBalance >= amount, "Amount exceeds available balance due to active bids");
        
        userDeposits[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit WithdrawalMade(msg.sender, amount);
    }

    function getAvailableBalance(address user) public view returns (uint256) {
        uint256 totalDeposit = userDeposits[user];
        uint256 lockedInBids = 0;
        
        // Calculate total locked in active bids
        for (uint256 i = 1; i < nextAuctionId; i++) {
            if (auctions[i].isActive && auctions[i].currentBidder == user) {
                lockedInBids += userBidsInAuction[i][user];
            }
        }
        
        return totalDeposit > lockedInBids ? totalDeposit - lockedInBids : 0;
    }

    function getAuction(uint256 auctionId) external view returns (AuctionItem memory) {
        return auctions[auctionId];
    }

    function getAuctionBids(uint256 auctionId) external view returns (Bid[] memory) {
        return auctionBids[auctionId];
    }

    function getActiveAuctions() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](nextAuctionId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextAuctionId; i++) {
            if (auctions[i].isActive && block.timestamp < auctions[i].endTime) {
                activeIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }
        
        return result;
    }

    function setCentralDepositAddress(address _centralDepositAddress) external onlyOwner {
        centralDepositAddress = _centralDepositAddress;
    }

    // Helper function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Required overrides
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721PausableUpgradeable
        )
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721URIStorageUpgradeable,
            UniversalNFTCore
        )
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            UniversalNFTCore
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    receive() external payable {
        // Allow contract to receive ZETA for gas payments
    }
}