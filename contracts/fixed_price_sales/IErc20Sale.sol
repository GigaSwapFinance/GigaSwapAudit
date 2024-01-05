// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import './IErc20SaleCounterOffer.sol';

/// @dev has whiteList
uint8 constant WHITELIST_FLAG = 1 << 0;
/// @dev has buy limit by addresses
uint8 constant BUYLIMIT_FLAG = 1 << 1;
/// @dev buy sends token to lock
uint8 constant LOCK_FLAG = 1 << 2;

struct PositionData {
    address owner;
    address asset1;
    address asset2;
    uint256 priceNom;
    uint256 priceDenom;
    uint256 count1;
    uint256 count2;
    /// @dev flags
    /// 0 - WHITELIST_FLAG has whiteList
    /// 1 - BUYLIMIT_FLAG has buy limit by addresses
    /// 2 - LOCK_FLAG buy sends token to lock
    uint8 flags;
}

/// @title settings for lock after token buy
struct BuyLockSettings {
    /// @notice receive token percent without lock.
    /// @dev see LOCK_PRECISION
    uint256 receivePercent;
    /// @notice lock time if unlockPercentByTime==0 or interval for unlock if unlockPercentByTime>0.
    /// @notice If this parameter is 0 than has no lock.
    uint256 lockTime;
    /// @notice percent for unlock every lockTime. Or 0 if unlock all after lockTime
    /// @dev see LOCK_PRECISION
    uint256 unlockPercentByTime;
}

/// @dev precision for lock after buy (0.01% ie. 100%=10000)
uint256 constant LOCK_PRECISION = 10000;

interface IErc20Sale is IErc20SaleCounterOffer {
    event OnCreate(
        uint256 indexed positionId,
        address indexed owner,
        address asset1,
        address asset2,
        uint256 priceNom,
        uint256 priceDenom
    );
    event OnBuy(
        uint256 indexed positionId,
        address indexed account,
        uint256 count
    );
    event OnPrice(
        uint256 indexed positionId,
        uint256 priceNom,
        uint256 priceDenom
    );
    event OnWithdraw(
        uint256 indexed positionId,
        uint256 assetCode,
        address to,
        uint256 count
    );
    event OnWhiteListed(
        uint256 indexed positionId,
        bool isWhiteListed,
        address[] accounts
    );
    event OnWhiteListEnabled(uint256 indexed positionId, bool enabled);
    event OnBuyLimitEnable(uint256 indexed positionId, bool enable);
    event OnBuyLimit(uint256 indexed positionId, uint256 limit);

    function createPosition(
        address asset1,
        address asset2,
        uint256 priceNom,
        uint256 priceDenom,
        uint256 count,
        uint8 flags,
        uint256 buyLimit,
        address[] calldata whiteList,
        BuyLockSettings calldata lockSettings
    ) external;

    function addBalance(uint256 positionId, uint256 count) external;

    function withdraw(
        uint256 positionId,
        uint256 assetCode,
        address to,
        uint256 count
    ) external;

    function withdrawAllTo(
        uint256 positionId,
        uint256 assetCode,
        address to
    ) external;

    function withdrawAll(uint256 positionId, uint256 assetCode) external;

    function setPrice(
        uint256 positionId,
        uint256 priceNom,
        uint256 priceDenom
    ) external;

    function setWhiteList(
        uint256 positionId,
        bool whiteListed,
        address[] calldata accounts
    ) external;

    function isWhiteListed(
        uint256 positionId,
        address account
    ) external view returns (bool);

    function enableWhiteList(uint256 positionId, bool enabled) external;

    function enableBuyLimit(uint256 positionId, bool enabled) external;

    function setBuyLimit(uint256 positionId, uint256 limit) external;

    function buy(
        uint256 positionId,
        address to,
        uint256 count,
        uint256 priceNom,
        uint256 priceDenom,
        address antibot
    ) external;

    function spendToBuy(
        uint256 positionId,
        uint256 count
    ) external view returns (uint256);

    function buyCount(
        uint256 positionId,
        uint256 spend
    ) external view returns (uint256);

    function getPosition(
        uint256 positionId
    ) external view returns (PositionData memory);

    function getPositionLockSettings(
        uint256 positionId
    ) external view returns (BuyLockSettings memory);
}
