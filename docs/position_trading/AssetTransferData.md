# Solidity API

## AssetTransferData

```solidity
struct AssetTransferData {
  uint256 positionId;
  struct ItemRef asset;
  uint256 assetCode;
  address from;
  address to;
  uint256 count;
  uint256[] data;
}
```

