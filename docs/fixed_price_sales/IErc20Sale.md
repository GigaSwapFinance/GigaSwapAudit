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
event OnCreate(uint256 positionId, address owner, address asset1, address asset2, uint256 priceNom, uint256 priceDenom)
```

### OnBuy

```solidity
event OnBuy(uint256 positionId, address account, uint256 count)
```

### OnPrice

```solidity
event OnPrice(uint256 positionId, uint256 priceNom, uint256 priceDenom)
```

### OnWithdraw

```solidity
event OnWithdraw(uint256 positionId, uint256 assetCode, address to, uint256 count)
```

### OnWhiteListed

```solidity
event OnWhiteListed(uint256 positionId, bool isWhiteListed, address[] accounts)
```

### OnWhiteListEnabled

```solidity
event OnWhiteListEnabled(uint256 positionId, bool enabled)
```

### OnBuyLimitEnable

```solidity
event OnBuyLimitEnable(uint256 positionId, bool enable)
```

### OnBuyLimit

```solidity
event OnBuyLimit(uint256 positionId, uint256 limit)
```

### createPosition

```solidity
function createPosition(address asset1, address asset2, uint256 priceNom, uint256 priceDenom, uint256 count, uint8 flags, uint256 buyLimit, address[] whiteList, struct BuyLockSettings lockSettings) external
```

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

