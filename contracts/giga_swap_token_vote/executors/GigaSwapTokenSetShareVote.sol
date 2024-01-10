// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import 'contracts/votes/VoteExecutorBase.sol';
import '../IGigaSwapTokenSetters.sol';

/// @title setShare vote ececutor data
struct Data {
    /// @notice new thisSharePpm
    uint256 thisSharePpm;
    /// @notice new stackingSharePpm
    uint256 stackingSharePpm;
}

/// @title setShare vote ececutor
contract GigaSwapTokenSetShareVote is VoteExecutorBase {
    mapping(uint256 => Data) public data;

    constructor(
        address voteAddress,
        address writerAddress
    ) VoteExecutorBase(voteAddress, writerAddress) {}

    /// @notice starts the vote
    /// @param thisSharePpm new thisSharePpm
    /// @param stackingSharePpm new stackingSharePpm
    function startVote(
        uint256 thisSharePpm,
        uint256 stackingSharePpm
    ) external payable {
        (uint256 voteId, ) = _startVote(msg.value, msg.sender);
        data[voteId].thisSharePpm = thisSharePpm;
        data[voteId].stackingSharePpm = stackingSharePpm;
    }

    function _execute(uint256 voteId) internal override {
        IGigaSwapTokenSetters(writer).setShare(
            data[voteId].thisSharePpm,
            data[voteId].stackingSharePpm
        );
    }
}
