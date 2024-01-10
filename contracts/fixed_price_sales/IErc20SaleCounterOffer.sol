// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title the offer data
struct OfferData {
    /// @notice position id
    uint256 positionId;
    /// @notice asset 1 offer count
    uint256 asset1Count;
    /// @notice asset 2 offer count
    uint256 asset2Count;
    /// @notice state
    /// @dev 0 - not created
    /// @dev 1 - created
    /// @dev 2 - applied
    uint8 state;
    /// @notice the offer owner (creator)
    address owner;
}

/// @title the ecr20sales offers interface
interface IErc20SaleCounterOffer {
    /// @notice new offer created
    /// @param positionId the position id
    /// @param offerId the offer id
    event OnOfer(uint256 indexed positionId, uint256 indexed offerId);
    /// @notice the position owner has applyed the offer
    /// @param positionId the position id
    /// @param offerId the offer id
    event OnApplyOfer(uint256 indexed positionId, uint256 indexed offerId);
    /// @notice the offer has been removed
    /// @param positionId the position id
    /// @param offerId the offer id
    event OnRemoveOfer(uint256 indexed positionId, uint256 indexed offerId);

    /// @notice creates the new offer to positiion
    /// @param positionId the position id
    /// @param asset1Count offered asset1 count
    /// @param asset2Count offered asset2 count
    function createOffer(
        uint256 positionId,
        uint256 asset1Count,
        uint256 asset2Count
    ) external;

    /// @notice removes the offer
    /// @param offerId the offer id
    function removeOffer(uint256 offerId) external;

    /// @notice returns the offer data
    /// @param offerId the offer id
    function getOffer(uint256 offerId) external returns (OfferData memory);

    /// @notice applies the offer to the position
    /// @dev only by position owner
    function applyOffer(uint256 offerId) external;
}
