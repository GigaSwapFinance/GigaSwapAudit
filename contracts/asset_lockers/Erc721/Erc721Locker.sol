// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '../IAssetLocker.sol';
import '../AssetLockerBase.sol';
import './IErc721Locker.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

contract Erc721Locker is AssetLockerBase, IErc721Locker {
    mapping(uint256 => Erc721LockData) _positions;

    constructor(
        address feeSettingsAddress
    ) AssetLockerBase(feeSettingsAddress) {}

    function position(
        uint256 id
    ) external view OnlyExistingPosition(id) returns (Erc721LockData memory) {
        return _positions[id];
    }

    function withdrawer(
        uint256 id
    ) external view override OnlyExistingPosition(id) returns (address) {
        return _positions[id].withdrawer;
    }

    function unlockTime(
        uint256 id
    ) external view override OnlyExistingPosition(id) returns (uint256) {
        return _positions[id].unlockTime;
    }

    function withdrawed(
        uint256 id
    ) public view override OnlyExistingPosition(id) returns (bool) {
        return _positions[id].withdrawed;
    }

    function _setWithdrawed(uint256 id) internal override {
        _positions[id].withdrawed = true;
    }

    function lockPermanent(
        address token,
        uint256[] calldata items
    ) external {
        _lock(token, 0, address(0), items);
    }

    function lockTimeFor(
        address token,
        uint256[] calldata items,
        uint256 unlockTime_,
        address withdrawer_
    ) external {
        _lock(token, unlockTime_, withdrawer_, items);
    }

    function lockTime(
        address token,
        uint256[] calldata items,
        uint256 unlockTime_
    ) external {
        _lock(token, unlockTime_, msg.sender, items);
    }

    function lockSecondsFor(
        address token,
        uint256[] calldata items,
        uint256 seconds_,
        address withdrawer_
    ) external {
        _lock(token, block.timestamp + seconds_, withdrawer_, items);
    }

    function lockSeconds(
        address token,
        uint256[] calldata items,
        uint256 seconds_
    ) external {
        _lock(token, block.timestamp + seconds_, msg.sender, items);
    }

    function _lock(
        address tokenAddress,
        uint256 unlockTime_,
        address withdrawer_,
        uint256[] calldata items
    ) private {
        require(items.length > 0, 'nothing to lock');
        uint256 id = _newPositionId();
        Erc721LockData storage data = _positions[id];
        data.token = tokenAddress;
        data.unlockTime = unlockTime_;
        data.withdrawer = withdrawer_;

        // fee transfer
        uint256 fee = _feeSettings.feeEthFor(withdrawer_);
        if (fee > 0) {
            (bool sentCount, ) = _feeSettings.feeAddress().call{ value: fee }(
                ''
            );
            require(sentCount, 'ethereum is not sent');
        }
        uint256 ethSurplus = msg.value - fee;
        if (ethSurplus > 0) {
            (bool surplusSent, ) = msg.sender.call{ value: ethSurplus }('');
            require(surplusSent, 'ethereum surplus is not sent');
        }
        // transfer the tokens
        IERC721 token = IERC721(tokenAddress);
        for (uint256 i = 0; i < items.length; ++i) {
            token.transferFrom(
                msg.sender,
                address(this),
                items[i]
            );
        }

        data.items = items;
        emit OnLockPosition(id);
    }

    function _withdraw(uint256 id) internal override {
        Erc721LockData memory data = _positions[id];
        IERC721 token = IERC721(data.token);
        for (uint256 i = 0; i < data.items.length; ++i) {
            token.transferFrom(address(this), msg.sender, data.items[i]);
        }
    }
}
