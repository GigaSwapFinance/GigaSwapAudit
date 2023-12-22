// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/votes/VoteExecutorBase.sol';
import '../IGigaSwapTokenSetters.sol';

contract GigaSwapTokenRemoveExtraContractAddressVote is VoteExecutorBase {
    constructor(
        address voteAddress,
        address writerAddress
    ) VoteExecutorBase(voteAddress, writerAddress) {}

    function startVote() external payable {
        _startVote(msg.value, msg.sender);
    }

    function _execute(uint256) internal override {
        IGigaSwapTokenSetters(writer).removeExtraContractAddress();
    }
}
