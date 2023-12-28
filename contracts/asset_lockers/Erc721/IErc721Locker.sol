// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../IAssetLocker.sol';
import './Erc721LockData.sol';

/// @title erc721 locker algorithm
interface IErc721Locker is IAssetLocker {
    /// @notice returns the locked position data
    /// @param id id of position
    /// @return Erc721LockData the locked position data
    function position(uint256 id) external view returns (Erc721LockData memory);

    /// @notice permanent locks the tokens. It can not be withdrawed
    /// @param token token address
    /// @param items items to lock
    function lockPermanent(
        address token,
        uint256[] calldata items
    ) external payable;

    /// @notice locks the tokens, that can be withdrawed by certait address
    /// @param token token address
    /// @param items items to lock
    /// @param unlockTime token unlock time
    /// @param withdrawer the address with withdraw right for position
    function lockTimeFor(
        address token,
        uint256[] calldata items,
        uint256 unlockTime,
        address withdrawer
    ) external payable;

    /// @notice locks the tokens, that can be withdraw by caller address
    /// @param token token address
    /// @param items items to lock
    /// @param unlockTime token unlock time
    function lockTime(
        address token,
        uint256[] calldata items,
        uint256 unlockTime
    ) external payable;

    /// @notice locks the token, that can be withdrawed by certait address
    /// @param token token address
    /// @param items token items to lock
    /// @param seconds_ seconds for lock
    /// @param withdrawer the address with withdraw right for position
    function lockSecondsFor(
        address token,
        uint256[] calldata items,
        uint256 seconds_,
        address withdrawer
    ) external payable;

    /// @notice locks the token, that can be withdrawed by certait address
    /// @param token token address
    /// @param items token items to lock
    /// @param seconds_ seconds for lock
    function lockSeconds(
        address token,
        uint256[] calldata items,
        uint256 seconds_
    ) external payable;
}
