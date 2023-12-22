// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../AssetLockerBase.sol';
import './IEthLocker.sol';

contract EthLocker is AssetLockerBase, IEthLocker {
    mapping(uint256 => EthLockData) _positions;

    constructor(
        address feeSettingsAddress
    ) AssetLockerBase(feeSettingsAddress) {}

    function position(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (EthLockData memory) {
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

    function lockTimeFor(
        uint256 unlockTime_,
        address withdrawer_
    ) external payable {
        _lock(unlockTime_, withdrawer_);
    }

    function lockTime(uint256 unlockTime_) external payable {
        _lock(unlockTime_, msg.sender);
    }

    function lockSecondsFor(
        uint256 seconds_,
        address withdrawer_
    ) external payable {
        _lock(block.timestamp + seconds_, withdrawer_);
    }

    function lockSeconds(uint256 seconds_) external payable {
        _lock(block.timestamp + seconds_, msg.sender);
    }

    function _lock(uint256 unlockTime_, address withdrawer_) private {
        require(unlockTime_ > 0, 'time can not be 0');
        require(withdrawer_ != address(0), 'withdrawer can not be 0');
        require(msg.value > 0, 'nothing to lock');
        uint256 id = _newPositionId();
        EthLockData storage data = _positions[id];
        data.unlockTime = unlockTime_;
        data.withdrawer = withdrawer_;
        data.fee = _feeSettings.feeForCount(withdrawer_, msg.value);

        // fee transfer
        if (data.fee > 0) {
            (bool sentCount, ) = _feeSettings.feeAddress().call{
                value: data.fee
            }('');
            require(sentCount, 'ethereum is not sent');
        }

        data.count = msg.value - data.fee;
        emit OnLockPosition(id);
    }

    function _withdraw(uint256 id) internal override {
        EthLockData memory data = _positions[id];
        (bool sentCount, ) = msg.sender.call{ value: data.count }('');
        require(sentCount, 'ethereum is not sent');
    }
}
