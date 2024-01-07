// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import 'contracts/fee/IFeeSettings.sol';
import './IErc20Sale.sol';
import '../lib/ownable/Ownable.sol';
import 'contracts/asset_lockers/erc20/IErc20Locker.sol';

struct BuyFunctionData {
    uint256 spend;
    uint256 buyFee;
    uint256 buyToTransfer;
    uint256 lastCount;
    uint256 transferred;
}

contract Erc20Sale is IErc20Sale {
    using SafeERC20 for IERC20;

    IFeeSettings public immutable feeSettings;
    IErc20Locker public immutable locker;
    mapping(uint256 => PositionData) _positions;
    mapping(uint256 => mapping(address => bool)) _whiteLists;
    mapping(uint256 => uint256) _limits;
    mapping(uint256 => mapping(address => uint256)) _usedLimits;
    mapping(uint256 => OfferData) _offers;
    mapping(uint256 => BuyLockSettings) _lockSettings;
    uint256 public totalOffers;
    uint256 _totalPositions;

    constructor(address feeSettings_, address locker_) {
        feeSettings = IFeeSettings(feeSettings_);
        locker = IErc20Locker(locker_);
    }

    function createPosition(
        address asset1,
        address asset2,
        uint256 priceNom,
        uint256 priceDenom,
        uint256 count,
        uint8 flags,
        uint256 buyLimit,
        address[] calldata whiteList,
        BuyLockSettings calldata lockSettings
    ) external {
        if (count > 0) {
            uint256 lastCount = IERC20(asset1).balanceOf(address(this));
            IERC20(asset1).safeTransferFrom(msg.sender, address(this), count);
            count = IERC20(asset1).balanceOf(address(this)) - lastCount;
        }

        _positions[++_totalPositions] = PositionData(
            msg.sender,
            asset1,
            asset2,
            priceNom,
            priceDenom,
            count,
            0,
            flags
        );

        if (flags & LOCK_FLAG > 0) {
            require(
                lockSettings.receivePercent < LOCK_PRECISION,
                'receive percent in lock must be less than 100% for lock'
            );
            require(
                lockSettings.receivePercent +
                    lockSettings.unlockPercentByTime <=
                    LOCK_PRECISION,
                'lock settings is not correct: receivePercent+unlockPercentByTime > LOCK_PRECISION'
            );
            _lockSettings[_totalPositions] = lockSettings;
        }

        if (buyLimit > 0) _limits[_totalPositions] = buyLimit;
        for (uint256 i = 0; i < whiteList.length; ++i)
            _whiteLists[_totalPositions][whiteList[i]] = true;

        emit OnCreate(
            _totalPositions,
            msg.sender,
            asset1,
            asset2,
            priceNom,
            priceDenom
        );
    }

    function createOffer(
        uint256 positionId,
        uint256 asset1Count,
        uint256 asset2Count
    ) external {
        // get position data
        PositionData memory position = _positions[positionId];
        require(position.owner != address(0), 'position is not exists');

        // create offer
        ++totalOffers;
        _offers[totalOffers].positionId = positionId;
        _offers[totalOffers].state = 1;
        _offers[totalOffers].owner = msg.sender;
        _offers[totalOffers].asset1Count = asset1Count;
        _offers[totalOffers].asset2Count = asset2Count;

        // transfer asset
        uint256 lastCount = IERC20(position.asset2).balanceOf(address(this));
        IERC20(position.asset2).safeTransferFrom(
            msg.sender,
            address(this),
            asset2Count
        );
        _offers[totalOffers].asset2Count =
            IERC20(position.asset2).balanceOf(address(this)) -
            lastCount;

        // event
        emit OnOfer(positionId, totalOffers);
    }

    function removeOffer(uint256 offerId) external {
        OfferData storage offer = _offers[offerId];
        require(offer.state == 1, 'offer is not created or already used');
        require(offer.owner == msg.sender, 'only owner can remove the offer');
        offer.state = 0;
        PositionData memory position = _positions[offer.positionId];
        IERC20(position.asset2).safeTransferFrom(
            address(this),
            offer.owner,
            offer.asset2Count
        );
        emit OnRemoveOfer(offer.positionId, offerId);
    }

    function applyOffer(uint256 offerId) external {
        // get offer
        OfferData storage offer = _offers[offerId];
        require(offer.state == 1, 'offer is not created or already used');
        offer.state = 2;

        // get position data
        PositionData storage position = _positions[offer.positionId];
        require(position.owner != address(0), 'position is not exists');
        require(position.owner == msg.sender, 'only owner can apply offer');

        // buyCount
        uint256 buyCount_ = offer.asset1Count;
        require(
            buyCount_ <= position.count1,
            'not enough owner asset to apply offer'
        );
        require(buyCount_ > 0, 'nothing to buy');

        // calculate the fee of buy count
        uint256 buyFee = (buyCount_ * feeSettings.feePercentFor(offer.owner)) /
            feeSettings.feeDecimals();
        uint256 buyToTransfer = buyCount_ - buyFee;

        // transfer the buy asset
        if (buyFee > 0)
            IERC20(position.asset1).safeTransfer(
                feeSettings.feeAddress(),
                buyFee
            );
        IERC20(position.asset1).safeTransfer(offer.owner, buyToTransfer);

        // transfer asset2 to position
        position.count1 -= buyCount_;
        position.count2 += offer.asset2Count;

        // event
        emit OnApplyOfer(offer.positionId, offerId);
    }

    function getOffer(
        uint256 offerId
    ) external view returns (OfferData memory) {
        return _offers[offerId];
    }

    function addBalance(uint256 positionId, uint256 count) external {
        PositionData storage pos = _positions[positionId];
        uint256 lastCount = IERC20(pos.asset1).balanceOf(address(this));
        IERC20(pos.asset1).safeTransferFrom(msg.sender, address(this), count);
        pos.count1 += IERC20(pos.asset1).balanceOf(address(this)) - lastCount;
    }

    function withdraw(
        uint256 positionId,
        uint256 assetCode,
        address to,
        uint256 count
    ) external {
        _withdraw(positionId, _positions[positionId], assetCode, to, count);
    }

    function withdrawAllTo(
        uint256 positionId,
        uint256 assetCode,
        address to
    ) external {
        PositionData storage pos = _positions[positionId];
        if (assetCode == 1)
            _withdraw(
                positionId,
                _positions[positionId],
                assetCode,
                to,
                pos.count1
            );
        else if (assetCode == 2)
            _withdraw(
                positionId,
                _positions[positionId],
                assetCode,
                to,
                pos.count2
            );
        else revert('unknown asset code');
    }

    function withdrawAll(uint256 positionId, uint256 assetCode) external {
        PositionData storage pos = _positions[positionId];
        if (assetCode == 1)
            _withdraw(
                positionId,
                _positions[positionId],
                assetCode,
                msg.sender,
                pos.count1
            );
        else if (assetCode == 2)
            _withdraw(
                positionId,
                _positions[positionId],
                assetCode,
                msg.sender,
                pos.count2
            );
        else revert('unknown asset code');
    }

    function _withdraw(
        uint256 positionId,
        PositionData storage pos,
        uint256 assetCode,
        address to,
        uint256 count
    ) private {
        require(pos.owner == msg.sender, 'only for position owner');
        uint256 fee = (feeSettings.feePercentFor(msg.sender) * count) /
            feeSettings.feeDecimals();
        uint256 toWithdraw = count - fee;

        if (assetCode == 1) {
            require(pos.count1 >= count, 'not enough asset count');
            uint256 lastCount = IERC20(pos.asset1).balanceOf(address(this));
            IERC20(pos.asset1).safeTransfer(feeSettings.feeAddress(), fee);
            IERC20(pos.asset1).safeTransfer(to, toWithdraw);
            uint256 transferred = lastCount -
                IERC20(pos.asset1).balanceOf(address(this));
            require(
                pos.count1 >= transferred,
                'not enough asset count after withdraw'
            );
            pos.count1 -= transferred;
        } else if (assetCode == 2) {
            require(pos.count2 >= count, 'not enough asset count');
            uint256 lastCount = IERC20(pos.asset2).balanceOf(address(this));
            IERC20(pos.asset2).safeTransfer(feeSettings.feeAddress(), fee);
            IERC20(pos.asset2).safeTransfer(to, toWithdraw);
            uint256 transferred = lastCount -
                IERC20(pos.asset2).balanceOf(address(this));
            require(
                pos.count2 >= transferred,
                'not enough asset count after withdraw'
            );
            pos.count2 -= transferred;
        } else revert('unknown asset code');

        emit OnWithdraw(positionId, assetCode, to, count);
    }

    function setPrice(
        uint256 positionId,
        uint256 priceNom,
        uint256 priceDenom
    ) external {
        PositionData storage pos = _positions[positionId];
        require(pos.owner == msg.sender, 'only for position owner');
        pos.priceNom = priceNom;
        pos.priceDenom = priceDenom;
        emit OnPrice(positionId, priceNom, priceDenom);
    }

    function setWhiteList(
        uint256 positionId,
        bool whiteListed,
        address[] calldata accounts
    ) external {
        PositionData storage pos = _positions[positionId];
        require(pos.owner == msg.sender, 'only for position owner');
        for (uint256 i = 0; i < accounts.length; ++i) {
            _whiteLists[positionId][accounts[i]] = whiteListed;
        }

        emit OnWhiteListed(positionId, whiteListed, accounts);
    }

    function isWhiteListed(
        uint256 positionId,
        address account
    ) external view returns (bool) {
        return _whiteLists[positionId][account];
    }

    function enableWhiteList(uint256 positionId, bool enabled) external {
        PositionData storage pos = _positions[positionId];
        require(pos.owner == msg.sender, 'only for position owner');

        if (enabled) pos.flags |= WHITELIST_FLAG;
        else pos.flags &= ~WHITELIST_FLAG;

        emit OnWhiteListEnabled(positionId, enabled);
    }

    function enableBuyLimit(uint256 positionId, bool enabled) external {
        PositionData storage pos = _positions[positionId];
        require(pos.owner == msg.sender, 'only for position owner');

        if (enabled) pos.flags |= BUYLIMIT_FLAG;
        else pos.flags &= ~BUYLIMIT_FLAG;

        emit OnBuyLimitEnable(positionId, enabled);
    }

    function setBuyLimit(uint256 positionId, uint256 limit) external {
        PositionData storage pos = _positions[positionId];
        require(pos.owner == msg.sender, 'only for position owner');

        _limits[positionId] = limit;

        emit OnBuyLimit(positionId, limit);
    }

    function buy(
        uint256 positionId,
        address to,
        uint256 count,
        uint256 priceNom,
        uint256 priceDenom,
        address antibot
    ) external {
        PositionData storage pos = _positions[positionId];
        BuyFunctionData memory data;

        // check antibot
        require(msg.sender == antibot, 'antibot');

        // check whitelist
        if (pos.flags & WHITELIST_FLAG > 0) {
            require(
                _whiteLists[positionId][msg.sender],
                'the account is not in whitelist'
            );
        }

        // check limit
        if (pos.flags & BUYLIMIT_FLAG > 0) {
            uint256 usedLimit = _usedLimits[positionId][msg.sender] + count;
            _usedLimits[positionId][msg.sender] = usedLimit;
            require(
                usedLimit <= _limits[positionId],
                'account buy limit is over'
            );
        }

        // price frontrun protection
        require(
            pos.priceNom == priceNom && pos.priceDenom == priceDenom,
            'the price is changed'
        );
        data.spend = _spendToBuy(pos, count);
        require(
            data.spend > 0,
            'spend asset count is zero (count parameter is less than minimum count to spend)'
        );
        data.buyFee =
            (count * feeSettings.feePercentFor(to)) /
            feeSettings.feeDecimals();
        data.buyToTransfer = count - data.buyFee;

        // transfer buy
        require(pos.count1 >= count, 'not enough asset count at position');
        data.lastCount = IERC20(pos.asset1).balanceOf(address(this));
        if (data.buyFee > 0)
            IERC20(pos.asset1).safeTransfer(
                feeSettings.feeAddress(),
                data.buyFee
            );
        // transfer to buyer
        if (pos.flags & LOCK_FLAG > 0) {
            IERC20(pos.asset1).approve(address(locker), type(uint256).max);
            BuyLockSettings memory lockSettings = _lockSettings[positionId];

            if (lockSettings.receivePercent > 0) {
                uint256 sendCount = (data.buyToTransfer *
                    lockSettings.receivePercent) / LOCK_PRECISION;
                uint256 fee = feeSettings.feeForCount(to, sendCount);
                if (fee > 0) IERC20(pos.asset1).safeTransfer(to, fee);
                IERC20(pos.asset1).safeTransfer(to, sendCount - fee);
                data.buyToTransfer -= sendCount;
            }
            locker.lockStepByStepUnlocking(
                pos.asset1,
                data.buyToTransfer,
                to,
                lockSettings.lockTime,
                (data.buyToTransfer * lockSettings.unlockPercentByTime) /
                    LOCK_PRECISION
            );
        } else {
            IERC20(pos.asset1).safeTransfer(to, data.buyToTransfer);
        }
        data.transferred =
            data.lastCount -
            IERC20(pos.asset1).balanceOf(address(this));
        require(
            pos.count1 >= data.transferred,
            'not enough asset count after withdraw'
        );
        pos.count1 -= data.transferred;

        // transfer spend
        data.lastCount = IERC20(pos.asset2).balanceOf(address(this));
        IERC20(pos.asset2).safeTransferFrom(
            msg.sender,
            address(this),
            data.spend
        );
        pos.count2 +=
            IERC20(pos.asset2).balanceOf(address(this)) -
            data.lastCount;

        // emit event
        emit OnBuy(positionId, to, count);
    }

    function spendToBuy(
        uint256 positionId,
        uint256 count
    ) external view returns (uint256) {
        return _spendToBuy(_positions[positionId], count);
    }

    function buyCount(
        uint256 positionId,
        uint256 spend
    ) external view returns (uint256) {
        PositionData memory pos = _positions[positionId];
        return (spend * pos.priceDenom) / pos.priceNom;
    }

    function _spendToBuy(
        PositionData memory pos,
        uint256 count
    ) private pure returns (uint256) {
        return (count * pos.priceNom) / pos.priceDenom;
    }

    function getPosition(
        uint256 positionId
    ) external view returns (PositionData memory) {
        return _positions[positionId];
    }

    function getPositionLockSettings(
        uint256 positionId
    ) external view returns (BuyLockSettings memory) {
        return _lockSettings[positionId];
    }
}
