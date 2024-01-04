// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import './IAssetLocker.sol';
import 'contracts/fee/IFeeSettings.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/// @title used to block asset for any time
abstract contract AssetLockerBase is IAssetLocker, ReentrancyGuard {
    /// @notice total created positions count
    uint256 _positionsCount;
    /// @notice tax system contract
    IFeeSettings immutable _feeSettings;

    /// @notice constructor
    /// @param feeSettingsAddress tax system contract
    constructor(address feeSettingsAddress) {
        _feeSettings = IFeeSettings(feeSettingsAddress);
    }

    /// @notice allows only existing positions
    modifier OnlyExistingPosition(uint256 positionId) {
        require(_positionExists(positionId), 'position is not exists');
        _;
    }

    /// @notice total created positions count
    function positionsCount() external view returns (uint256) {
        return _positionsCount;
    }

    /// @notice returns tax system contract address
    function feeSettings() external view returns (address) {
        return address(_feeSettings);
    }

    /// @notice returns true, if position is locked
    /// @param id id of position
    /// @return bool true if locked
    function isLocked(uint256 id) external view returns (bool) {
        return _isLocked(id);
    }

    function _isLocked(uint256 id) internal view virtual returns (bool) {
        uint256 time = this.unlockTime(id);
        return time == 0 || time > block.timestamp;
    }

    /// @notice returns true if asset locked permanently
    /// @param id id of  position
    function isPermanentLock(uint256 id) external view returns (bool) {
        return this.unlockTime(id) == 0;
    }

    /// @notice withdraws the position
    /// @param id id of position
    function withdraw(uint256 id) external nonReentrant {
        require(!this.withdrawed(id), 'already withdrawed');
        require(!this.isPermanentLock(id), 'locked permanently');
        require(!this.isLocked(id), 'still locked');
        require(this.withdrawer(id) == msg.sender, 'only for withdrawer');
        _withdraw(id);
        _setWithdrawed(id);
        emit OnWithdraw(id);
    }

    /// @dev internal withdraw algorithm, asset speciffic
    /// @param id id of position
    function _withdraw(uint256 id) internal virtual;

    /// @dev internal sets position as withdrawed to prevent re-withdrawal
    /// @param id id of position
    function _setWithdrawed(uint256 id) internal virtual;

    /// @dev returns new position ID
    function _newPositionId() internal returns (uint256) {
        return ++_positionsCount;
    }

    /// @dev returns true, if position is exists
    function _positionExists(uint256 positionId) internal view returns (bool) {
        return positionId > 0 && positionId <= _positionsCount;
    }
}
