// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title erc20 lock data
struct Erc20LockData {
    /// @notice locked token
    address token;
    /// @notice the address with withdraw right for position
    address withdrawer;
    /// @notice position unlock pime
    uint256 unlockTime;
    /// @notice if true, than position is withdrawed
    bool withdrawed;
    /// @notice count of token, without decimals, that can be withdrawed
    uint256 count;
}
