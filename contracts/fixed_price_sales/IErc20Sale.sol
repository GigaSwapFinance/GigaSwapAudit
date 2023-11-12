// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

uint8 constant WHITELIST_FLAG = 1 << 0; // has whiteList
uint8 constant BUYLIMIT_FLAG = 1 << 1; // has buy limit by addresses
uint8 constant PACKET_FLAG = 1 << 2;// buy sends token to packet

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
    /// 2 - PACKET_FLAG buy sends token to packet
    uint8 flags;
}

interface IErc20Sale {
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

    function getPosition(
        uint256 positionId
    ) external view returns (PositionData memory);

    function getPositionPacketClaimTime(
        uint256 positionId
    ) external view returns (uint256);
}
