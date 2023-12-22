# Solidity API

## PositionsFactory

### positionsController

```solidity
contract IPositionsController positionsController
```

### ethAssetsController

```solidity
contract IAssetsController ethAssetsController
```

### erc20AssetsController

```solidity
contract IAssetsController erc20AssetsController
```

### erc721AssetsController

```solidity
contract IAssetsController erc721AssetsController
```

### lockAlgorithm

```solidity
contract IPositionAlgorithm lockAlgorithm
```

### tradingPair

```solidity
contract ITradingPairAlgorithm tradingPair
```

### constructor

```solidity
constructor(address positionsController_, address ethAssetsController_, address erc20AssetsController_, address erc721AssetsController_, address lockAlgorithm_, address tradingPair_) public
```

### receive

```solidity
receive() external payable
```

### createLockPosition

```solidity
function createLockPosition(struct AssetCreationData data1, uint256 lockSeconds) external payable returns (uint256 ethSurplus)
```

### createTradingPairPosition

```solidity
function createTradingPairPosition(struct AssetCreationData data1, struct AssetCreationData data2, struct FeeSettings feeSettings, struct TradingPairConstraints constraints) external payable returns (uint256 ethSurplus)
```

### _createAsset

```solidity
function _createAsset(uint256 positionId, uint256 assetCode, struct AssetCreationData data, uint256 ethSurplus) internal returns (uint256)
```

