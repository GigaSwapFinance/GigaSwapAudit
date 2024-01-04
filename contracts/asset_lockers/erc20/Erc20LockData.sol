// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title erc20 lock data
struct Erc20LockData {
    /// @notice locked token
    address token;
    /// @notice the address with withdraw right for position
    address withdrawer;
    /// @notice position unlock time or unlock time interval if step-by-step
    uint256 creationTime;
    /// @notice position unlock time interval
    uint256 timeInterval;
    /// @notice how many tokens are withdrawed already
    uint256 withdrawedCount;
    /// @notice whole lock count
    uint256 count;
    /// @notice if >0 than unlock is step-by-step and this equal for one unlock count
    uint256 stepByStepUnlockCount;
}
