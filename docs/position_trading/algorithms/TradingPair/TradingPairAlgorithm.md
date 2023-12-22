# Solidity API

## SwapVars

```solidity
struct SwapVars {
  uint256 inputlastCount;
  uint256 buyCount;
  uint256 lastPrice;
  uint256 newPrice;
  uint256 snapPrice;
  uint256 outFee;
  uint256 priceImpact;
  uint256 slippage;
}
```

## AddLiquidityVars

```solidity
struct AddLiquidityVars {
  uint256 assetBCode;
  uint256 countB;
  uint256 lastAssetACount;
  uint256 lastCountA;
  uint256 lastCountB;
  uint256 liquidityTokensToMint;
}
```

## SwapSnapshot

```solidity
struct SwapSnapshot {
  uint256 input;
  uint256 output;
  uint256 slippage;
}
```

## PositionAddingAssets

```solidity
struct PositionAddingAssets {
  struct ItemRef asset1;
  struct ItemRef asset2;
}
```

## TradingPairAlgorithm

error codes:
1 - no liquidity tokens
2 - not enough liquidity tokens balance
3 - locked
4 - not enough fee tokens balance
5 - not enough asset to buy
6 - price changed more than slippage
7 - too large price impact
8 - the position is not locked
9 - has no snapshot
10 - forward swap is disallowed
11 - back swap is disallowed
12 - position id is not exists
13 - transferred asset 1 count to pair is not correct
14 - transferred asset 2 count to pair is not correct
15 - block use limit
16 - add liquidity calculated countB is zero
17 - add liquidity assetA count is zero
18 - has no output count

### priceDecimals

```solidity
uint256 priceDecimals
```

### fee

```solidity
mapping(uint256 => struct FeeSettings) fee
```

### constraints

```solidity
mapping(uint256 => struct TradingPairConstraints) constraints
```

### liquidityTokens

```solidity
mapping(uint256 => contract IErc20ForFactory) liquidityTokens
```

### feeTokens

```solidity
mapping(uint256 => contract IErc20ForFactory) feeTokens
```

### feedistributors

```solidity
mapping(uint256 => address) feedistributors
```

### lastUseBlocks

```solidity
mapping(uint256 => mapping(address => uint256)) lastUseBlocks
```

### erc20Factory

```solidity
contract IErc20ForFactoryFactory erc20Factory
```

### constructor

```solidity
constructor(address positionsControllerAddress, address erc20Factory_) public
```

### receive

```solidity
receive() external payable
```

### createAlgorithm

```solidity
function createAlgorithm(uint256 positionId, struct FeeSettings feeSettings, struct TradingPairConstraints constraints_) external
```

### getFeeSettings

```solidity
function getFeeSettings(uint256 positionId) external view returns (struct FeeSettings)
```

_get fee settings of trading pair_

### getConstraints

```solidity
function getConstraints(uint256 positionId) external view returns (struct TradingPairConstraints)
```

_returns the positions constraints_

### _positionLocked

```solidity
function _positionLocked(uint256 positionId) internal view returns (bool)
```

### _isPermanentLock

```solidity
function _isPermanentLock(uint256 positionId) internal view returns (bool)
```

### addLiquidity

```solidity
function addLiquidity(uint256 positionId, uint256 assetCode, uint256 count) external payable returns (uint256 ethSurplus)
```

### _getAssets

```solidity
function _getAssets(uint256 positionId) internal view returns (struct ItemRef asset1, struct ItemRef asset2)
```

### getAsset1Price

```solidity
function getAsset1Price(uint256 positionId) external view returns (uint256)
```

### _getAsset1Price

```solidity
function _getAsset1Price(uint256 positionId) internal view returns (uint256)
```

### getAsset2Price

```solidity
function getAsset2Price(uint256 positionId) external view returns (uint256)
```

### _getAsset2Price

```solidity
function _getAsset2Price(uint256 positionId) internal view returns (uint256)
```

### getBuyCount

```solidity
function getBuyCount(uint256 positionId, uint256 inputAssetCode, uint256 amount) external view returns (uint256)
```

### _getBuyCount

```solidity
function _getBuyCount(uint256 inputLastCount, uint256 inputNewCount, uint256 outputLastCount) internal pure returns (uint256)
```

### _afterAssetTransfer

```solidity
function _afterAssetTransfer(struct AssetTransferData arg) internal virtual
```

### _swap

```solidity
function _swap(uint256 positionId, address from, uint256 amount, struct ItemRef input, struct ItemRef output, struct AssetFee inputFee, struct AssetFee outputFee, struct SwapSnapshot snapshot, struct ItemRef inputFeeAsset, struct ItemRef outputFeeAsset) internal
```

### withdraw

```solidity
function withdraw(uint256 positionId, uint256 liquidityCount) external
```

_withdraw_

### checkCanWithdraw

```solidity
function checkCanWithdraw(struct ItemRef asset, uint256, uint256) external view
```

### getSnapshot

```solidity
function getSnapshot(uint256 positionId, uint256 slippage) external view returns (uint256, uint256, uint256)
```

_returns snapshot for make swap_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | id of the position |
| slippage | uint256 | slippage in 1/100000 parts (for example 20% slippage is 20000) |

### getPositionsController

```solidity
function getPositionsController() external view returns (address)
```

_the positions controller_

### getLiquidityToken

```solidity
function getLiquidityToken(uint256 positionId) external view returns (address)
```

_the liquidity token address_

### getFeeToken

```solidity
function getFeeToken(uint256 positionId) external view returns (address)
```

_the fee token address_

### getFeeDistributer

```solidity
function getFeeDistributer(uint256 positionId) external view returns (address)
```

_returns the fee distributer for position_

### ClaimFeeReward

```solidity
function ClaimFeeReward(uint256 positionId, address account, uint256 asset1Count, uint256 asset2Count, uint256 feeTokensCount) external
```

_notify that fee reward has claimed
only for fee distributors_

