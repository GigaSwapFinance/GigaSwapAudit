// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../IAssetLocker.sol';
import './EthLockData.sol';

/// @title eth locker algorithm
interface IEthLocker is IAssetLocker {
    /// @notice returns the locked position data
    /// @param id id of position
    /// @return EthLockData the locked position data
    function position(uint256 id) external view returns (EthLockData memory);

    /// @notice locks the ethereum, that can be withdrawed by certait address
    /// @param unlockTime unlock time
    /// @param withdrawer the address with withdraw right for position
    function lockTimeFor(
        uint256 unlockTime,
        address withdrawer
    ) external payable;

    /// @notice locks the ethereum, that can be withdraw by caller address
    /// @param unlockTime unlock time or 0 if permanent lock
    function lockTime(uint256 unlockTime) external payable;

    /// @notice locks the ethereum, that can be withdrawed by certait address
    /// @param seconds_ lock seconds
    /// @param withdrawer the address with withdraw right for position
    function lockSecondsFor(
        uint256 seconds_,
        address withdrawer
    ) external payable;

    /// @notice locks the ethereum, that can be withdrawed
    /// @param seconds_ lock seconds
    function lockSeconds(uint256 seconds_) external payable;
}
