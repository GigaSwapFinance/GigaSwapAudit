# Solidity API

## AssetFee

```solidity
struct AssetFee {
  uint256 input;
  uint256 output;
}
```

## FeeSettings

```solidity
struct FeeSettings {
  uint256 feeRoundIntervalHours;
  struct AssetFee asset1;
  struct AssetFee asset2;
}
```

