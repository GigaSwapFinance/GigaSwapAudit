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

    function unlockTime(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (uint256) {
        return _positions[id].unlockTime;
    }

    function withdrawed(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (bool) {
        return _positions[id].withdrawed;
    }

    function _setWithdrawed(uint256 id) internal override {
        _positions[id].withdrawed = true;
    }

    function lockPermanent(address token, uint256 count) external {
        _lock(token, count, 0, address(0));
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

    function _lock(
        address tokenAddress,
        uint256 count,
        uint256 unlockTime_,
        address withdrawer_
    ) private {
        require(count > 0, 'nothing to lock');
        uint256 id = _newPositionId();
        Erc20LockData storage data = _positions[id];
        data.token = tokenAddress;
        data.unlockTime = unlockTime_;
        data.withdrawer = withdrawer_;
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
        IERC20(data.token).safeTransfer(data.withdrawer, data.count);
    }
}
