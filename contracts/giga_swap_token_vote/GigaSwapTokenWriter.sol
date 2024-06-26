// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import './IGigaSwapTokenSetters.sol';
import 'contracts/lib/factories/HasFactories.sol';

/// @title the writer for giga swap settings by votes
/// @dev when is owner of contract - it can change contract properties that onlyOwner
contract GigaSwapTokenWriter is HasFactories, IGigaSwapTokenSetters {
    IGigaSwapTokenSetters public immutable token;

    constructor(address tokenAddress) {
        token = IGigaSwapTokenSetters(tokenAddress);
    }

    function setBuyFee(uint256 newBuyFeePpm) external {
        token.setBuyFee(newBuyFeePpm);
    }

    function setSellFee(uint256 newSellFeePpm) external {
        token.setSellFee(newSellFeePpm);
    }

    function SetExtraContractAddress(address newExtraContractAddress) external {
        token.SetExtraContractAddress(newExtraContractAddress);
    }

    function removeExtraContractAddress() external {
        token.removeExtraContractAddress();
    }

    function setShare(uint256 thisSharePpm, uint256 stackingSharePpm) external {
        token.setShare(thisSharePpm, stackingSharePpm);
    }

    function setWithdrawAddress(address newWithdrawAddress) external {
        token.setWithdrawAddress(newWithdrawAddress);
    }
}
