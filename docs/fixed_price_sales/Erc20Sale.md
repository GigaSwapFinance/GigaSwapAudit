# Solidity API

## BuyFunctionData

```solidity
struct BuyFunctionData {
  uint256 spend;
  uint256 buyFee;
  uint256 buyToTransfer;
  uint256 lastCount;
  uint256 transferred;
}
```

## Erc20Sale

### feeSettings

```solidity
contract IFeeSettings feeSettings
```

### packet

```solidity
contract IPacketErc20 packet
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

### _packetClaimTimes

```solidity
mapping(uint256 => uint256) _packetClaimTimes
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
constructor(address feeSettings_, address packet_) public
```

### createOffer

```solidity
function createOffer(uint256 positionId, uint256 asset1Count, uint256 asset2Count) external
```

### removeOffer

```solidity
function removeOffer(uint256 offerId) external
```

### applyOffer

```solidity
function applyOffer(uint256 offerId) external
```

### getOffer

```solidity
function getOffer(uint256 offerId) external view returns (struct OfferData)
```

### createPosition

```solidity
function createPosition(address asset1, address asset2, uint256 priceNom, uint256 priceDenom, uint256 count, uint8 flags, uint256 buyLimit, address[] whiteList, uint256 packetClaimTime) external
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

### getPosition

```solidity
function getPosition(uint256 positionId) external view returns (struct PositionData)
```

### getPositionPacketClaimTime

```solidity
function getPositionPacketClaimTime(uint256 positionId) external view returns (uint256)
```

