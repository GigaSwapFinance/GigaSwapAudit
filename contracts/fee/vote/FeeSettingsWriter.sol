// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/lib/factories/HasFactories.sol';
import 'contracts/fee/IFeeSettingsSetters.sol';

/// @title the fee settings writer, that is owner of GigaSwap system fee contract
/// @dev owner of the FeeSettings contract and this contract performs changes to the voting results
contract FeeSettingsWriter is HasFactories, IFeeSettingsSetters {
    IFeeSettingsSetters public immutable feeSettings;

    constructor(address feeSettingsAddress) {
        feeSettings = IFeeSettingsSetters(feeSettingsAddress);
    }

    function setFeeAddress(address newFeeAddress) external onlyFactory {
        feeSettings.setFeeAddress(newFeeAddress);
    }

    function setFeePercent(uint256 newFeePercent) external onlyFactory {
        feeSettings.setFeePercent(newFeePercent);
    }

    function setFeeEth(uint256 newFeeEth) external onlyFactory {
        feeSettings.setFeeEth(newFeeEth);
    }
}
