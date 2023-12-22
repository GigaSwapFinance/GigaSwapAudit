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

    /// @notice permanent locks the erc20 tokens. It can not be withdrawed
    /// @param token token address
    /// @param count token count without decimals
    function lockPermanent(address token, uint256 count) external;

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
}
