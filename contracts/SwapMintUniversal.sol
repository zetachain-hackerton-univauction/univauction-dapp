// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IZRC20} from "@zetachain/protocol-contracts/contracts/zevm/interfaces/IZRC20.sol";
import {SwapHelperLib} from "@zetachain/toolkit/contracts/SwapHelperLib.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import {GatewayZEVM} from "@zetachain/protocol-contracts/contracts/zevm/GatewayZEVM.sol";
import {RevertContext, RevertOptions} from "@zetachain/protocol-contracts/contracts/Revert.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IUSDCPricedNFT {
    function mintWithUSDC(address to, string calldata uri) external returns (uint256 tokenId);
    function mintPrice() external view returns (uint256);
    function USDC() external view returns (address);
}

contract SwapMintUniversal is
    UniversalContract,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address public uniswapRouter;       // UniswapV2 Router on ZetaChain
    GatewayZEVM public gateway;         // ZEVM Gateway
    uint256 public gasLimit;            // onRevert 가스

    error Unauthorized();
    error Invalid();
    error AmountTooSmall();

    event MintedAfterSwap(
        bytes indexed originSender,
        address indexed inputZRC20,
        uint256 inputAmount,
        address indexed nft,
        uint256 tokenId,
        address usdcZRC20,
        uint256 usdcSpent,
        address recipient
    );

    modifier onlyGateway() {
        if (msg.sender != address(gateway)) revert Unauthorized();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(
        address payable gatewayAddress,
        address uniswapRouterAddress,
        uint256 gasLimitAmount,
        address owner_
    ) external initializer {
        if (gatewayAddress == address(0) || uniswapRouterAddress == address(0)) revert Invalid();
        __Ownable_init(owner_);
        __UUPSUpgradeable_init();
        gateway = GatewayZEVM(gatewayAddress);
        uniswapRouter = uniswapRouterAddress;
        gasLimit = gasLimitAmount;
    }

    struct MsgParams {
        address usdcZRC20;  // 스왑 대상 ZRC-20(USDC)
        address nft;        // ZetaUSDCPricedNFT 주소
        bytes   recipient;  // 수신자(20바이트 EVM 주소)
        string  tokenURI;   // 민팅할 메타데이터 URI
    }

    function onCall(
        MessageContext calldata context,
        address inputZRC20,
        uint256 amount,
        bytes calldata message
    ) external onlyGateway {
        // message에는 이제 usdcZRC20, nft, tokenURI 만 포함하도록 단순화
        (address usdcZRC20, address nftAddr, string memory tokenURI) =
            abi.decode(message, (address, address, string));

        // 1) inputZRC20 -> USDC로 스왑
        uint256 outUSDC;
        if (inputZRC20 == usdcZRC20) {
            outUSDC = amount;
        } else {
            outUSDC = SwapHelperLib.swapExactTokensForTokens(
                uniswapRouter,
                inputZRC20,
                amount,
                usdcZRC20,
                0
            );
        }

        // 2) NFT 민팅가 확인
        IUSDCPricedNFT nft = IUSDCPricedNFT(nftAddr);
        uint256 price = nft.mintPrice();
        require(outUSDC >= price, "Not enough USDC");

        // 3) NFT 컨트랙트에 approve
        IZRC20(usdcZRC20).approve(nftAddr, price);

        // 4) 민팅 대상은 context.sender (Gateway에서 전달된 원래 보낸 사람)
        address to = address(uint160(bytes20(context.sender)));

        // 5) 민팅
        uint256 tokenId = nft.mintWithUSDC(to, tokenURI);

        emit MintedAfterSwap(
            abi.encodePacked(context.sender),
            inputZRC20,
            amount,
            nftAddr,
            tokenId,
            usdcZRC20,
            price,
            to
        );
    }

    // onRevert 예시(스왑/민팅 실패 시 리커버리 필요하면 확장)
    function onRevert(RevertContext calldata) external onlyGateway {
        // 커스텀 리커버리 로직을 여기에
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
