// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/votes/VoteExecutorBase.sol';
import '../IGigaSwapTokenSetters.sol';

/// @title setBuyFee vote ececutor
contract GigaSwapTokenSetBuyFeeVote is VoteExecutorBase {
    mapping(uint256 => uint256) public data;

    constructor(
        address voteAddress,
        address writerAddress
    ) VoteExecutorBase(voteAddress, writerAddress) {}

    /// @notice starts the vote
    /// @param newValue new buy fee
    function startVote(uint256 newValue) external payable {
        (uint256 voteId, ) = _startVote(msg.value, msg.sender);
        data[voteId] = newValue;
    }

    function _execute(uint256 voteId) internal override {
        IGigaSwapTokenSetters(writer).setBuyFee(data[voteId]);
    }
}
