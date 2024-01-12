// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../AssetLockerBase.sol';
import './IErc20Locker.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Erc20Locker is AssetLockerBase, IErc20Locker {
    using SafeERC20 for IERC20;
    mapping(uint256 => Erc20LockData) _positions;

    constructor(
        address feeSettingsAddress
    ) AssetLockerBase(feeSettingsAddress) {}

    function position(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (Erc20LockData memory) {
        return _positions[id];
    }

    function withdrawer(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (address) {
        return _positions[id].withdrawer;
    }

    function _isLocked(uint256 id) internal view override returns (bool) {
        Erc20LockData memory data = _positions[id];
        if (data.stepByStepUnlockCount == 0) return super._isLocked(id);
        return _unlockedCountWithdrawAvailable(id) == 0 && super._isLocked(id);
    }

    function unlockTime(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (uint256) {
        uint256 remain = _remainingTokensToWithdraw(id);
        if (remain == 0) return 0;
        Erc20LockData memory data = _positions[id];
        if (data.stepByStepUnlockCount == 0) return this.unlockAllTime(id);
        uint256 unlocked = _unlockedCount(id);
        if (unlocked >= data.count) return this.unlockAllTime(id);
        return
            data.creationTime +
            ((block.timestamp - data.creationTime) / data.timeInterval + 1) *
            data.timeInterval;
    }

    function unlockAllTime(uint256 id) external view returns (uint256) {
        Erc20LockData memory data = _positions[id];
        if (data.stepByStepUnlockCount == 0)
            return data.creationTime + data.timeInterval;
        if (data.count % data.stepByStepUnlockCount == 0) {
            return
                data.creationTime +
                (_positions[id].count / data.stepByStepUnlockCount) *
                _positions[id].timeInterval;
        } else {
            return
                data.creationTime +
                (data.count / data.stepByStepUnlockCount) *
                data.timeInterval +
                data.stepByStepUnlockCount;
        }
    }

    function remainingTokensToWithdraw(
        uint256 id
    ) external view returns (uint256) {
        return _remainingTokensToWithdraw(id);
    }

    function _remainingTokensToWithdraw(
        uint256 id
    ) internal view returns (uint256) {
        return _positions[id].count - _positions[id].withdrawedCount;
    }

    function withdrawed(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (bool) {
        return _positions[id].withdrawedCount >= _positions[id].count;
    }

    function _setWithdrawed(uint256 id) internal override {
        _positions[id].withdrawedCount += _unlockedCountWithdrawAvailable(id);
    }

    function lockTimeFor(
        address token,
        uint256 count,
        uint256 unlockTime_,
        address withdrawer_
    ) external {
        require(unlockTime_ > 0, 'time can not be zero');
        require(withdrawer_ != address(0), 'withdrawer can not be zero');
        _lock(token, count, unlockTime_, withdrawer_);
    }

    function lockTime(
        address token,
        uint256 count,
        uint256 unlockTime_
    ) external {
        require(unlockTime_ > 0, 'time can not be zero');
        _lock(token, count, unlockTime_, msg.sender);
    }

    function lockSecondsFor(
        address token,
        uint256 count,
        uint256 seconds_,
        address withdrawer_
    ) external {
        require(withdrawer_ != address(0), 'withdrawer can not be zero');
        _lock(token, count, block.timestamp + seconds_, withdrawer_);
    }

    function lockSeconds(
        address token,
        uint256 count,
        uint256 seconds_
    ) external {
        _lock(token, count, block.timestamp + seconds_, msg.sender);
    }

    function lockStepByStepUnlocking(
        address tokenAddress,
        uint256 count,
        address withdrawer_,
        uint256 interval,
        uint256 stepByStepUnlockCount
    ) external {
        _lock(
            tokenAddress,
            count,
            withdrawer_,
            interval,
            stepByStepUnlockCount
        );
    }

    function _lock(
        address tokenAddress,
        uint256 count,
        uint256 unlockTime_,
        address withdrawer_
    ) private {
        _lock(
            tokenAddress,
            count,
            withdrawer_,
            unlockTime_ - block.timestamp,
            0
        );
    }

    function _lock(
        address tokenAddress,
        uint256 count,
        address withdrawer_,
        uint256 interval,
        uint256 stepByStepUnlockCount
    ) internal {
        require(count > 0, 'nothing to lock');
        uint256 id = _newPositionId();
        Erc20LockData storage data = _positions[id];
        data.token = tokenAddress;
        data.creationTime = block.timestamp;
        data.timeInterval = interval;
        data.withdrawer = withdrawer_;
        data.stepByStepUnlockCount = stepByStepUnlockCount;
        uint256 fee = _feeSettings.feeForCount(withdrawer_, count);

        IERC20 token = IERC20(tokenAddress);

        // fee transfer
        if (fee > 0)
            token.safeTransferFrom(msg.sender, _feeSettings.feeAddress(), fee);

        // lock transfer
        uint256 lastCount = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), count - fee);
        data.count = token.balanceOf(address(this)) - lastCount;
        emit OnLockPosition(id);
    }

    function _withdraw(uint256 id) internal override {
        Erc20LockData memory data = _positions[id];
        IERC20(data.token).safeTransfer(
            data.withdrawer,
            _unlockedCountWithdrawAvailable(id)
        );
    }

    function unlockedCount(uint256 id) external view returns (uint256) {
        return _unlockedCount(id);
    }

    function _unlockedCount(uint256 id) internal view returns (uint256) {
        Erc20LockData memory data = _positions[id];
        if (data.stepByStepUnlockCount == 0) {
            if (this.isLocked(id)) return 0;
            else return data.count;
        }

        uint256 unlocked = ((block.timestamp - data.creationTime) /
            data.timeInterval) * data.stepByStepUnlockCount;
        if (unlocked > data.count) unlocked = data.count;
        return unlocked;
    }

    function unlockedCountWithdrawAvailable(
        uint256 id
    ) external view returns (uint256) {
        return _unlockedCountWithdrawAvailable(id);
    }

    function _unlockedCountWithdrawAvailable(
        uint256 id
    ) internal view returns (uint256) {
        Erc20LockData memory data = _positions[id];
        if (data.stepByStepUnlockCount == 0) {
            if (this.isLocked(id)) return 0;
            return data.count;
        }

        return _unlockedCount(id) - data.withdrawedCount;
    }
}
