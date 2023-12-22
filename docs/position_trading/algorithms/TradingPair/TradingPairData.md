# Solidity API

## TradingPairData

```solidity
struct TradingPairData {
  uint256 positionId;
  address owner;
  address liquidityToken;
  uint256 liquidityTokenTotalSupply;
  struct FeeSettings feeSettings;
  address feeToken;
  uint256 feeTokenTotalSupply;
  address feeDistributer;
  uint256 feeDistributerAsset1Count;
  uint256 feeDistributerAsset2Count;
  struct AssetData asset1;
  struct AssetData asset2;
  struct TradingPairConstraints constraints;
}
```

