// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../IAssetLocker.sol';
import './Erc20LockData.sol';

/// @title erc20 lock algorithm
interface IErc20Locker is IAssetLocker {
    /// @notice returns the locked position data
    /// @param id id of position
    /// @return Erc20LockData the locked position data
    function position(uint256 id) external view returns (Erc20LockData memory);

    /// @notice locks the erc20 tokens, that can be withdrawed by certait address
    /// @param token token address
    /// @param count token count without decimals
    /// @param unlockTime token unlock time
    /// @param withdrawer the address with withdraw right for position
    function lockTimeFor(
        address token,
        uint256 count,
        uint256 unlockTime,
        address withdrawer
    ) external;

    /// @notice locks the erc20 tokens, that can be withdraw by caller address
    /// @param token token address
    /// @param count token count without decimals
    /// @param unlockTime token unlock time
    function lockTime(
        address token,
        uint256 count,
        uint256 unlockTime
    ) external;

    /// @notice locks the token, that can be withdrawed by certait address
    /// @param token token address
    /// @param count token count without decimals
    /// @param seconds_ seconds for lock
    /// @param withdrawer the address with withdraw right for position
    function lockSecondsFor(
        address token,
        uint256 count,
        uint256 seconds_,
        address withdrawer
    ) external;

    /// @notice locks the token, that can be withdrawed by certait address
    /// @param token token address
    /// @param count token count without decimals
    /// @param seconds_ seconds for lock
    function lockSeconds(
        address token,
        uint256 count,
        uint256 seconds_
    ) external;

    /// @notice locks the step-by-step unlocking position
    /// @param tokenAddress token address
    /// @param count token count without decimals for lock
    /// @param withdrawer the address with withdraw right for position
    /// @param interval the interval for unlock
    /// @param stepByStepUnlockCount how many tokens are unlocked each interval
    function lockStepByStepUnlocking(
        address tokenAddress,
        uint256 count,
        address withdrawer,
        uint256 interval,
        uint256 stepByStepUnlockCount
    ) external;

    /// @notice remaining tokens for withdraw
    function remainingTokensToWithdraw(uint256 id) external view returns (uint256);

    /// @notice unlocked tokens count. All unlocked tokens.(withdrawen and not)
    function unlockedCount(uint256 id) external view returns (uint256);

    /// @notice unlocked tokens count. Available for withdraw
    function unlockedCountWithdrawAvailable(uint256 id) external view returns (uint256);

    /// @notice the unlock all time
    function unlockAllTime(uint256 id) external view returns (uint256);
}
