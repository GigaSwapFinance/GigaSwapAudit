// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title fee settings setters interface
interface IFeeSettingsSetters {
    /// @notice sets address for pay fee
    /// @param newFeeAddress new fee address
    function setFeeAddress(address newFeeAddress) external;

    /// @notice sets new fee percent
    /// @param newFeePercent new fee percent
    function setFeePercent(uint256 newFeePercent) external;

    /// @notice sets new ethereum fee for indivisible assets
    /// @param newFeeEth new ethereum fee for indivisible assets
    function setFeeEth(uint256 newFeeEth) external;
}
