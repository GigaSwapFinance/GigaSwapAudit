// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @notice controller for swap deals
interface IDealPointsController {
    receive() external payable;

    /// @notice returns type id of deal points
    /// @return 
    /// 1 - eth;
    /// 2 - erc20;
    /// 3 - erc721 item;
    /// 4 - erc721 count;
    function dealPointTypeId() external pure returns (uint256);

    /// @notice returns deal id for deal point or 0 if point is not exists in this controller
    function dealId(uint256 pointId) external view returns (uint256);

    /// @notice token contract address, that need to be transferred or zero
    function tokenAddress(uint256 pointId) external view returns (address);

    /// @notice from
    /// @dev zero address - for open swap
    function from(uint256 pointId) external view returns (address);

    /// @notice to
    function to(uint256 pointId) external view returns (address);

    /// @notice withdrawTimer
    function withdrawTimer(uint256 pointId) external view returns (uint256);

    /// @notice returns allowed times to withdraw assets after executing
    function withdrawTime(uint256 positionId) external view returns (uint256);

    /// @notice sets to account for point
    /// @dev only DealsController and only once
    function setTo(uint256 pointId, address account) external;

    /// @notice asset value (count or nft id), needs to execute deal point
    function value(uint256 pointId) external view returns (uint256);

    /// @notice balance of the deal point
    function balance(uint256 pointId) external view returns (uint256);

    /// @notice deal point fee. In ether or token. Only if withdraw after deal is swapped
    function fee(uint256 pointId) external view returns (uint256);

    /// @notice if true, than fee is ether, that sends on withdraw after swapped
    function feeIsEthOnWithdraw() external pure returns (bool);

    /// @notice current owner of deal point
    /// @dev zero address - for open deals, before execution
    function owner(uint256 pointId) external view returns (address);

    /// @notice deals controller
    function dealsController() external view returns (address);

    /// @notice if true, than deal is swapped
    function isSwapped(uint256 pointId) external view returns (bool);

    /// @notice if true, than point is executed and can be swapped
    function isExecuted(uint256 pointId) external view returns (bool);

    /// @notice executes the point, by using address
    /// @dev if already executed than nothing happens
    function execute(uint256 pointId, address addr) external payable;

    /// @notice the execute ether value for owner with number
    function executeEtherValue(uint256 pointId) external view returns (uint256);

    /// @notice withdraw the asset from deal point
    /// @dev only deals controller
    function withdraw(uint256 pointId) external payable;
}
