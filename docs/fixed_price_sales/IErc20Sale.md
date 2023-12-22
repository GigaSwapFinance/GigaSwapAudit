# Solidity API

## WHITELIST_FLAG

```solidity
uint8 WHITELIST_FLAG
```

## BUYLIMIT_FLAG

```solidity
uint8 BUYLIMIT_FLAG
```

## PACKET_FLAG

```solidity
uint8 PACKET_FLAG
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

### getPosition

```solidity
function getPosition(uint256 positionId) external view returns (struct PositionData)
```

### getPositionPacketClaimTime

```solidity
function getPositionPacketClaimTime(uint256 positionId) external view returns (uint256)
```

