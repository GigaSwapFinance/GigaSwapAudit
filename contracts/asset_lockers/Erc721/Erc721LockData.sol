// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title ethereum lock data
struct Erc721LockData {
    /// @notice locked token
    address token;
    /// @notice the address with withdraw right for position
    address withdrawer;
    /// @notice position unlock pime
    uint256 unlockTime;
    /// @notice if true, than position is withdrawed
    bool withdrawed;
    /// @notice locked items
    uint256[] items;
}
