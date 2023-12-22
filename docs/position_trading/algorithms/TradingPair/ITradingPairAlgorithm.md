# Solidity API

## ITradingPairAlgorithm

### OnSwap

```solidity
event OnSwap(uint256 positionId, address account, uint256 inputAssetId, uint256 outputAssetId, uint256 inputCount, uint256 outputCount)
```

_swap event_

### OnAddLiquidity

```solidity
event OnAddLiquidity(uint256 positionId, address account, uint256 asset1Count, uint256 asset2Count, uint256 liquidityTokensCount)
```

_add liquidity event_

### OnRemoveLiquidity

```solidity
event OnRemoveLiquidity(uint256 positionId, address account, uint256 asset1Count, uint256 asset2Count, uint256 liquidityTokensCount)
```

_remove liquidity event_

### OnClaimFeeReward

```solidity
event OnClaimFeeReward(uint256 positionId, address account, uint256 asset1Count, uint256 asset2Count, uint256 feeTokensCount)
```

_fee reward claimed_

### createAlgorithm

```solidity
function createAlgorithm(uint256 positionId, struct FeeSettings feeSettings, struct TradingPairConstraints constraints) external
```

_creates the algorithm
onlyFactory_

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

### getFeeSettings

```solidity
function getFeeSettings(uint256 positionId) external view returns (struct FeeSettings)
```

_get fee settings of trading pair_

### getFeeDistributer

```solidity
function getFeeDistributer(uint256 positionId) external view returns (address)
```

_returns the fee distributer for position_

### getConstraints

```solidity
function getConstraints(uint256 positionId) external view returns (struct TradingPairConstraints)
```

_returns the positions constraints_

### withdraw

```solidity
function withdraw(uint256 positionId, uint256 liquidityCount) external
```

_withdraw_

### addLiquidity

```solidity
function addLiquidity(uint256 position, uint256 assetCode, uint256 count) external payable returns (uint256 ethSurplus)
```

_adds liquidity
returns ethereum surplus sent back to the sender_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint256 |  |
| assetCode | uint256 | the asset code for count to add (another asset count is calculates) |
| count | uint256 | count of the asset (another asset count is calculates) |

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

### ClaimFeeReward

```solidity
function ClaimFeeReward(uint256 positionId, address account, uint256 asset1Count, uint256 asset2Count, uint256 feeTokensCount) external
```

_notify that fee reward has claimed
only for fee distributors_

