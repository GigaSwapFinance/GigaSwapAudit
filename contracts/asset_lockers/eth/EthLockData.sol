// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title ethereum lock data
struct EthLockData {
    /// @notice the address with withdraw right for position
    address withdrawer;
    /// @notice position unlock pime
    uint256 unlockTime;
    /// @notice if true, than position is withdrawed
    bool withdrawed;
    /// @notice count of ethereum, without decimals, that can be withdrawed
    uint256 count;
    /// @notice paid locking fee
    /// @dev all fee calculations is for withdrawer
    uint256 fee;
}