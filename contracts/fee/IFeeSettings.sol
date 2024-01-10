// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

/// @title the fee settings of GigaSwap system interface
interface IFeeSettings {
    /// @notice address to pay fee
    function feeAddress() external view returns (address);

    /// @notice fee in 1/decimals for dividing values
    function feePercent() external view returns (uint256);

    /// @notice account fee share
    /// @dev used only if asset is dividing
    /// @dev fee in 1/feeDecimals for dividing values
    /// @param account the account, that can be hold GigaSwap token
    /// @return uint256 asset fee share in 1/feeDecimals
    function feePercentFor(address account) external view returns (uint256);

    /// @notice account fee for certain asset count
    /// @dev used only if asset is dividing
    /// @param account the account, that can be hold GigaSwap token
    /// @param count asset count for calculate fee
    /// @return uint256 asset fee count
    function feeForCount(
        address account,
        uint256 count
    ) external view returns (uint256);

    /// @notice decimals for fee shares
    function feeDecimals() external view returns (uint256);

    /// @notice fix fee value
    /// @dev used only if asset is not dividing
    function feeEth() external view returns (uint256);

    /// @notice fee in 1/decimals for dividing values
    function feeEthFor(address account) external view returns (uint256);

    /// @notice if account balance is greather than or equal this value, than this account has no fee
    function zeroFeeShare() external view returns (uint256);
}
