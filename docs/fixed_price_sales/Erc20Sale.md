# Solidity API

## BuyFunctionData

```solidity
struct BuyFunctionData {
  uint256 spend;
  uint256 lastCount;
  uint256 transferred;
  uint256 sendCount;
}
```

## Erc20Sale

### feeSettings

```solidity
contract IFeeSettings feeSettings
```

### locker

```solidity
contract IErc20Locker locker
```

### _positions

```solidity
mapping(uint256 => struct PositionData) _positions
```

### _whiteLists

```solidity
mapping(uint256 => mapping(address => bool)) _whiteLists
```

### _limits

```solidity
mapping(uint256 => uint256) _limits
```

### _usedLimits

```solidity
mapping(uint256 => mapping(address => uint256)) _usedLimits
```

### _offers

```solidity
mapping(uint256 => struct OfferData) _offers
```

### _lockSettings

```solidity
mapping(uint256 => struct BuyLockSettings) _lockSettings
```

### totalOffers

```solidity
uint256 totalOffers
```

### _totalPositions

```solidity
uint256 _totalPositions
```

### constructor

```solidity
constructor(address feeSettings_, address locker_) public
```

### createPosition

```solidity
function createPosition(address asset1, address asset2, uint256 priceNom, uint256 priceDenom, uint256 count, uint256 buyLimit, address[] whiteList, struct BuyLockSettings lockSettings) external
```

creates new position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| asset1 | address | asset for sale |
| asset2 | address | asset that wish to buy |
| priceNom | uint256 | price nomenator |
| priceDenom | uint256 | price denomenator |
| count | uint256 | count of asset to sale |
| buyLimit | uint256 | one buy libit or zero |
| whiteList | address[] | if not empty - accounts, that can buy |
| lockSettings | struct BuyLockSettings | settings if after buy use lock |

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

### applyOffer

```solidity
function applyOffer(uint256 offerId) external
```

applies the offer to the position

_only by position owner_

### getOffer

```solidity
function getOffer(uint256 offerId) external view returns (struct OfferData)
```

returns the offer data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offerId | uint256 | the offer id |

### addBalance

```solidity
function addBalance(uint256 positionId, uint256 count) external
```

### withdraw

```solidity
function withdraw(uint256 positionId, uint256 assetCode, address to, uint256 count) external
```

### withdrawAllTo

```solidity
function withdrawAllTo(uint256 positionId, uint256 assetCode, address to) external
```

### withdrawAll

```solidity
function withdrawAll(uint256 positionId, uint256 assetCode) external
```

### setPrice

```solidity
function setPrice(uint256 positionId, uint256 priceNom, uint256 priceDenom) external
```

### setWhiteList

```solidity
function setWhiteList(uint256 positionId, bool whiteListed, address[] accounts) external
```

### isWhiteListed

```solidity
function isWhiteListed(uint256 positionId, address account) external view returns (bool)
```

### enableWhiteList

```solidity
function enableWhiteList(uint256 positionId, bool enabled) external
```

### enableBuyLimit

```solidity
function enableBuyLimit(uint256 positionId, bool enabled) external
```

### setBuyLimit

```solidity
function setBuyLimit(uint256 positionId, uint256 limit) external
```

### buy

```solidity
function buy(uint256 positionId, address to, uint256 count, uint256 priceNom, uint256 priceDenom, address antibot) external
```

### spendToBuy

```solidity
function spendToBuy(uint256 positionId, uint256 count) external view returns (uint256)
```

### buyCount

```solidity
function buyCount(uint256 positionId, uint256 spend) external view returns (uint256)
```

### getPosition

```solidity
function getPosition(uint256 positionId) external view returns (struct PositionData)
```

### getPositionLockSettings

```solidity
function getPositionLockSettings(uint256 positionId) external view returns (struct BuyLockSettings)
```

