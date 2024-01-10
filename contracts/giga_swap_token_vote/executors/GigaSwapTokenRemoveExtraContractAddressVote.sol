// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/votes/VoteExecutorBase.sol';
import '../IGigaSwapTokenSetters.sol';

/// @title removeExtraContractAddress vote ececutor
contract GigaSwapTokenRemoveExtraContractAddressVote is VoteExecutorBase {
    constructor(
        address voteAddress,
        address writerAddress
    ) VoteExecutorBase(voteAddress, writerAddress) {}

    /// @notice starts the vote
    function startVote() external payable {
        _startVote(msg.value, msg.sender);
    }

    function _execute(uint256) internal override {
        IGigaSwapTokenSetters(writer).removeExtraContractAddress();
    }
}
