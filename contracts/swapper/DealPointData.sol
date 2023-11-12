// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

struct DealPointData {
    address controller;
    uint256 id;
    /// @dev deal point id
    /// 1 - eth
    /// 2 - erc20
    /// 3 erc721 item
    /// 4 erc721 count
    uint256 dealPointTypeId;
    uint256 dealId;
    address from;
    address to;
    uint256 withdrawTimer;
    uint256 withdrawTime;
    address owner;
    uint256 value;
    uint256 balance;
    uint256 fee;
    address tokenAddress;
    bool isSwapped;
    bool isExecuted;
}
