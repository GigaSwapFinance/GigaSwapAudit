// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @dev the erc20 stack data
struct Stack {
    uint256 claimTime; // when can to claim stack
    uint256 count; // erc20 count
}

interface IPacketErc20 {
    /// @dev on new stack
    event OnAddStack(
        address indexed account,
        address tokenAddress,
        uint256 count,
        uint256 claimTime
    );
    /// @dev on claim token
    event OnClaim(address indexed account, address tokenAddress, uint256 count);

    /// @dev adds tokens stack for account
    function addStack(
        address account,
        address tokenAddress,
        uint256 count,
        uint256 claimTimer
    ) external;

    /// @dev returns all stacks of account
    function stacks(
        address account,
        address tokenAddress
    ) external view returns (Stack[] memory);

    /// @dev balance of account (include all accounts stacks)
    function balance(
        address account,
        address tokenAddress
    ) external view returns (uint256);

    /// @dev claim count for account on current time (includes stacks can be claimed at moment only)
    function claimCount(
        address account,
        address tokenAddress
    ) external view returns (uint256);

    /// @dev claims all stacks, that can be claimet at monment
    function claim(address tokenAddress) external;
}
