// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title used to block asset for any time
interface IAssetLocker {
    /// @notice new position locked
    /// @param id id of new locked position
    event OnLockPosition(uint256 id);
    /// @notice position withdrawed
    /// @param id id of new locked position
    event OnWithdraw(uint256 id);

    /// @notice total created positions count
    function positionsCount() external view returns (uint256);

    /// @notice returns tax system contract address
    function feeSettings() external view returns (address);

    /// @notice the address with withdraw right for position
    /// @param id id of position
    /// @return address the address with withdraw right for position
    function withdrawer(uint256 id) external view returns (address);

    /// @notice time when the position will be unlocked
    /// @param id id of position
    /// @return uint256 linux epoh time, when unlock or 0 if lock permanently
    function unlockTime(uint256 id) external view returns (uint256);

    /// @notice  returns true, if position is locked
    /// @param id id of position
    /// @return bool true if locked
    function isLocked(uint256 id) external view returns (bool);

    /// @notice if true than position is already withdrawed
    /// @param id id of position
    /// @return bool true if position is withdrawed
    function withdrawed(uint256 id) external view returns (bool);

    /// @notice withdraws the position
    /// @param id id of position
    function withdraw(uint256 id) external;
}
