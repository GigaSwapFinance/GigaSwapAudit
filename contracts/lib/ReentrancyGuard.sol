// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

contract ReentrancyGuard {
    uint256 private _reentered;

    modifier nonReentrant() {
        require(_reentered != 1);
        _reentered = 1;
        _;
        _reentered = 0;
    }
}