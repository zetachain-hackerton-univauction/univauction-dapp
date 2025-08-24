// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IZRC20} from "@zetachain/protocol-contracts/contracts/zevm/interfaces/IZRC20.sol";
import {SwapHelperLib} from "@zetachain/toolkit/contracts/SwapHelperLib.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "@zetachain/protocol-contracts/contracts/zevm/interfaces/UniversalContract.sol";
import {GatewayZEVM} from "@zetachain/protocol-contracts/contracts/zevm/GatewayZEVM.sol";
import {RevertContext} from "@zetachain/protocol-contracts/contracts/Revert.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract SwapOnlyUniversal is
    UniversalContract,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address public uniswapRouter;   // UniswapV2 Router on ZetaChain
    GatewayZEVM public gateway;     // ZEVM Gateway
    uint256 public gasLimit;        // onRevert 가스

    error Unauthorized();
    error Invalid();

    event Swapped(
        bytes indexed originSender,
        address indexed inputZRC20,
        uint256 inputAmount,
        address indexed outputZRC20,
        uint256 outputAmount
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

    /// @notice message = (outputZRC20) 으로 단순화
    function onCall(
        MessageContext calldata context,
        address inputZRC20,
        uint256 amount,
        bytes calldata message
    ) external onlyGateway {
        address outputZRC20 = abi.decode(message, (address));

        uint256 outAmount;
        if (inputZRC20 == outputZRC20) {
            outAmount = amount;
        } else {
            outAmount = SwapHelperLib.swapExactTokensForTokens(
                uniswapRouter,
                inputZRC20,
                amount,
                outputZRC20,
                0
            );
        }

        emit Swapped(
            abi.encodePacked(context.sender),
            inputZRC20,
            amount,
            outputZRC20,
            outAmount
        );
    }

    function onRevert(RevertContext calldata) external onlyGateway {
        // 필요하다면 revert 처리 로직 추가
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
