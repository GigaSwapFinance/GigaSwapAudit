# Solidity API

## PositionAlgorithm

_basic algorithm position_

### positionsController

```solidity
contract IPositionsController positionsController
```

### constructor

```solidity
constructor(address positionsControllerAddress) internal
```

### onlyPositionOwner

```solidity
modifier onlyPositionOwner(uint256 positionId)
```

### onlyFactory

```solidity
modifier onlyFactory()
```

### onlyPositionsController

```solidity
modifier onlyPositionsController()
```

### onlyBuildMode

```solidity
modifier onlyBuildMode(uint256 positionId)
```

### beforeAssetTransfer

```solidity
function beforeAssetTransfer(struct AssetTransferData arg) external
```

### _beforeAssetTransfer

```solidity
function _beforeAssetTransfer(struct AssetTransferData arg) internal virtual
```

### afterAssetTransfer

```solidity
function afterAssetTransfer(struct AssetTransferData arg) external payable
```

### _afterAssetTransfer

```solidity
function _afterAssetTransfer(struct AssetTransferData arg) internal virtual
```

### withdrawAsset

```solidity
function withdrawAsset(uint256 positionId, uint256 assetCode, address recipient, uint256 amount) external
```

### _withdrawAsset

```solidity
function _withdrawAsset(uint256 positionId, uint256 assetCode, address recipient, uint256 amount) internal virtual
```

### lockPosition

```solidity
function lockPosition(uint256 positionId, uint256 lockSeconds) external
```

### lockPermanent

```solidity
function lockPermanent(uint256 positionId) external
```

