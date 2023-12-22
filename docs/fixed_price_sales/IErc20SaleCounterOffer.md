# Solidity API

## OfferData

```solidity
struct OfferData {
  uint256 positionId;
  uint256 asset1Count;
  uint256 asset2Count;
  uint8 state;
  address owner;
}
```

## IErc20SaleCounterOffer

### OnOfer

```solidity
event OnOfer(uint256 positionId, uint256 offerId)
```

### OnApplyOfer

```solidity
event OnApplyOfer(uint256 positionId, uint256 offerId)
```

### OnRemoveOfer

```solidity
event OnRemoveOfer(uint256 positionId, uint256 offerId)
```

### createOffer

```solidity
function createOffer(uint256 positionId, uint256 asset1Count, uint256 asset2Count) external
```

### removeOffer

```solidity
function removeOffer(uint256 offerId) external
```

### getOffer

```solidity
function getOffer(uint256 offerId) external returns (struct OfferData)
```

### applyOffer

```solidity
function applyOffer(uint256 offerId) external
```

