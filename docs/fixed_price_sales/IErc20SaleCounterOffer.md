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

new offer created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | the position id |
| offerId | uint256 | the offer id |

### OnApplyOfer

```solidity
event OnApplyOfer(uint256 positionId, uint256 offerId)
```

the position owner has applyed the offer

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | the position id |
| offerId | uint256 | the offer id |

### OnRemoveOfer

```solidity
event OnRemoveOfer(uint256 positionId, uint256 offerId)
```

the offer has been removed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | the position id |
| offerId | uint256 | the offer id |

### createOffer

```solidity
function createOffer(uint256 positionId, uint256 asset1Count, uint256 asset2Count) external
```

creates the new offer to positiion

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | the position id |
| asset1Count | uint256 | offered asset1 count |
| asset2Count | uint256 | offered asset2 count |

### removeOffer

```solidity
function removeOffer(uint256 offerId) external
```

removes the offer

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offerId | uint256 | the offer id |

### getOffer

```solidity
function getOffer(uint256 offerId) external returns (struct OfferData)
```

returns the offer data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offerId | uint256 | the offer id |

### applyOffer

```solidity
function applyOffer(uint256 offerId) external
```

applies the offer to the position

_only by position owner_

