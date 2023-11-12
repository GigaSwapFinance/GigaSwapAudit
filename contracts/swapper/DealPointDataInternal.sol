// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

struct DealPointDataInternal {
    uint256 dealId;
    uint256 value;
    address from;
    address to;
    uint256 withdrawTimer; // withdraw timer after execute
}