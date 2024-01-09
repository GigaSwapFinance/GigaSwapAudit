// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import './IErc20SaleCounterOffer.sol';

/// @dev has whiteList
uint8 constant WHITELIST_FLAG = 1 << 0;
/// @dev has buy limit by addresses
uint8 constant BUYLIMIT_FLAG = 1 << 1;
/// @dev buy sends token to lock
uint8 constant LOCK_FLAG = 1 << 2;

/// @title the position main data
struct PositionData {
    /// @notice position owner
    address owner;
    /// @notice asset address, that sells owner
    address asset1;
    /// @notice asset address, that owner wish to buy
    address asset2;
    /// @notice price nomenator
    uint256 priceNom;
    /// @notice price denomenator
    uint256 priceDenom;
    /// @notice asset1 count
    uint256 count1;
    /// @notice asset2 count
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

/// @title erc20sale contract
interface IErc20Sale is IErc20SaleCounterOffer {
    /// @notice when position created
    /// @param positionId id of position
    event OnCreate(uint256 indexed positionId);
    /// @notice when buy happens
    /// @param positionId id of position
    /// @param account buyer
    /// @param count buy count
    event OnBuy(
        uint256 indexed positionId,
        address indexed account,
        uint256 count
    );
    /// @notice position price changed
    /// @param positionId id of position
    event OnPrice(uint256 indexed positionId);
    /// @notice owner withdraw asset from position
    /// @param positionId id of position
    /// @param assetCode asset code
    /// @param to address to withdraw
    /// @param count asset count
    event OnWithdraw(
        uint256 indexed positionId,
        uint256 assetCode,
        address to,
        uint256 count
    );
    /// @notice white list is changed
    /// @param positionId id of position
    /// @param isWhiteListed witelisted or not
    /// @param accounts accounts list
    event OnWhiteListed(
        uint256 indexed positionId,
        bool isWhiteListed,
        address[] accounts
    );
    /// @notice white list is enabled
    /// @param positionId id of position
    /// @param enabled enabled or not
    event OnWhiteListEnabled(uint256 indexed positionId, bool enabled);
    /// @notice buy limit is enabled
    /// @param positionId id of position
    /// @param enable enabled or not
    event OnBuyLimitEnable(uint256 indexed positionId, bool enable);
    /// @notice buy limit is changed
    /// @param positionId id of position
    /// @param limit new buy limit
    event OnBuyLimit(uint256 indexed positionId, uint256 limit);

    /// @notice creates new position
    /// @param asset1 asset for sale
    /// @param asset2 asset that wish to buy
    /// @param priceNom price nomenator
    /// @param priceDenom price denomenator
    /// @param count count of asset to sale
    /// @param buyLimit one buy libit or zero
    /// @param whiteList if not empty - accounts, that can buy
    /// @param lockSettings settings if after buy use lock
    function createPosition(
        address asset1,
        address asset2,
        uint256 priceNom,
        uint256 priceDenom,
        uint256 count,
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
