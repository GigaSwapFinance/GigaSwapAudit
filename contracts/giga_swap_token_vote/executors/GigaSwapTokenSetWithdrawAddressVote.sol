// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/votes/VoteExecutorBase.sol';
import '../IGigaSwapTokenSetters.sol';

/// @title setWithdrawAddress vote ececutor
contract GigaSwapTokenSetWithdrawAddressVote is VoteExecutorBase {
    mapping(uint256 => address) public data;

    constructor(
        address voteAddress,
        address writerAddress
    ) VoteExecutorBase(voteAddress, writerAddress) {}

    /// @notice starts the vote
    /// @param newValue new WithdrawAddress
    function startVote(address newValue) external payable {
        (uint256 voteId, ) = _startVote(msg.value, msg.sender);
        data[voteId] = newValue;
    }

    function _execute(uint256 voteId) internal override {
        IGigaSwapTokenSetters(writer).setWithdrawAddress(data[voteId]);
    }
}
