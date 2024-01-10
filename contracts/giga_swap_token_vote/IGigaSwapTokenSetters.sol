// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title the setter for giga swap settings by votes
interface IGigaSwapTokenSetters {
    /// @notice sets buy fee
    function setBuyFee(uint256 newBuyFeePpm) external;
    /// @notice sets sell fee
    function setSellFee(uint256 newSellFeePpm) external;
    /// @notice sets Extra Contract Address
    function SetExtraContractAddress(address newExtraContractAddress) external;
    /// @notice removes Extra Contract Address
    function removeExtraContractAddress() external;
    /// @notice sets shares
    function setShare(uint256 thisSharePpm, uint256 stackingSharePpm) external;
    /// @notice sets withdraw fee address
    function setWithdrawAddress(address newWithdrawAddress) external;
}
