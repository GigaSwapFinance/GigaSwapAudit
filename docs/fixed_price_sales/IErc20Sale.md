# Solidity API

## WHITELIST_FLAG

```solidity
uint8 WHITELIST_FLAG
```

## BUYLIMIT_FLAG

```solidity
uint8 BUYLIMIT_FLAG
```

## LOCK_FLAG

```solidity
uint8 LOCK_FLAG
```

## PositionData

```solidity
struct PositionData {
  address owner;
  address asset1;
  address asset2;
  uint256 priceNom;
  uint256 priceDenom;
  uint256 count1;
  uint256 count2;
  uint8 flags;
}
```

## BuyLockSettings

```solidity
struct BuyLockSettings {
  uint256 receivePercent;
  uint256 lockTime;
  uint256 unlockPercentByTime;
}
```

## LOCK_PRECISION

```solidity
uint256 LOCK_PRECISION
```

## IErc20Sale

### OnCreate

```solidity
event OnCreate(uint256 positionId)
```

when position created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |

### OnBuy

```solidity
event OnBuy(uint256 positionId, address account, uint256 count)
```

when buy happens

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| account | address | buyer |
| count | uint256 | buy count |

### OnPrice

```solidity
event OnPrice(uint256 positionId)
```

position price changed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |

### OnWithdraw

```solidity
event OnWithdraw(uint256 positionId, uint256 assetCode, address to, uint256 count)
```

owner withdraw asset from position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| assetCode | uint256 | asset code |
| to | address | address to withdraw |
| count | uint256 | asset count |

### OnWhiteListed

```solidity
event OnWhiteListed(uint256 positionId, bool isWhiteListed, address[] accounts)
```

white list is changed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| isWhiteListed | bool | witelisted or not |
| accounts | address[] | accounts list |

### OnWhiteListEnabled

```solidity
event OnWhiteListEnabled(uint256 positionId, bool enabled)
```

white list is enabled

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| enabled | bool | enabled or not |

### OnBuyLimitEnable

```solidity
event OnBuyLimitEnable(uint256 positionId, bool enable)
```

buy limit is enabled

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| enable | bool | enabled or not |

### OnBuyLimit

```solidity
event OnBuyLimit(uint256 positionId, uint256 limit)
```

buy limit is changed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of position |
| limit | uint256 | new buy limit |

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

