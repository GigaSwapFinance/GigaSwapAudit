// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title enables owner of contract
interface IOwnable {
    /// @notice owner of contract
    function owner() external view returns (address);

    /// @notice transfers ownership of contract
    /// @param newOwner new owner of contract
    function transferOwnership(address newOwner) external;
}
