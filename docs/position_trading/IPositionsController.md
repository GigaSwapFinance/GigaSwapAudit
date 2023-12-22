# Solidity API

## IPositionsController

### NewPosition

```solidity
event NewPosition(address account, address algorithmAddress, uint256 positionId)
```

_new position created_

### getFeeSettings

```solidity
function getFeeSettings() external view returns (contract IFeeSettings)
```

_returns fee settings_

### createPosition

```solidity
function createPosition(address owner) external returns (uint256)
```

_creates a position_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | the owner of the position only factory, only build mode |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | id of new position |

### getPosition

```solidity
function getPosition(uint256 positionId) external view returns (address algorithm, struct AssetData asset1, struct AssetData asset2)
```

_returns position data_

### positionsCount

```solidity
function positionsCount() external view returns (uint256)
```

_returns total positions count_

### ownerOf

```solidity
function ownerOf(uint256 positionId) external view returns (address)
```

_returns the position owner_

### getAsset

```solidity
function getAsset(uint256 positionId, uint256 assetCode) external view returns (struct AssetData data)
```

_returns an asset by its code in position 1 or 2_

### getAllPositionAssetReferences

```solidity
function getAllPositionAssetReferences(uint256 positionId) external view returns (struct ItemRef position1, struct ItemRef position2)
```

_returns position assets references_

### getAssetReference

```solidity
function getAssetReference(uint256 positionId, uint256 assetCode) external view returns (struct ItemRef)
```

_returns asset reference by its code in position 1 or 2_

### getAssetPositionId

```solidity
function getAssetPositionId(uint256 assetId) external view returns (uint256)
```

_returns position of tne specific asset id_

### createAsset

```solidity
function createAsset(uint256 positionId, uint256 assetCode, address assetsController) external returns (struct ItemRef)
```

_creates an asset to position, generates asset reference_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| positionId | uint256 | position ID |
| assetCode | uint256 | asset code 1 - owner asset 2 - output asset |
| assetsController | address | reference to asset only factories, only build mode |

### setAlgorithm

```solidity
function setAlgorithm(uint256 positionId, address algorithmController) external
```

_sets the position algorithm
id of algorithm is id of the position
only factory, only build mode_

### getAlgorithm

```solidity
function getAlgorithm(uint256 positionId) external view returns (address)
```

_returns the position algorithm contract_

### isBuildMode

```solidity
function isBuildMode(uint256 positionId) external view returns (bool)
```

_if true, than position in build mode_

### stopBuild

```solidity
function stopBuild(uint256 positionId) external
```

_stops the position build mode
onlyFactories, onlyBuildMode_

### assetsCount

```solidity
function assetsCount() external view returns (uint256)
```

_returns total assets count_

### createNewAssetId

```solidity
function createNewAssetId() external returns (uint256)
```

_returns new asset id and increments assetsCount
only factories_

### transferToAsset

```solidity
function transferToAsset(uint256 positionId, uint256 assetCode, uint256 count, uint256[] data) external payable returns (uint256 ethSurplus)
```

_transfers caller asset to asset_

### transferToAssetFrom

```solidity
function transferToAssetFrom(address from, uint256 positionId, uint256 assetCode, uint256 count, uint256[] data) external payable returns (uint256 ethSurplus)
```

_transfers to asset from account
returns ethereum surplus sent back to the sender
onlyFactory_

### withdraw

```solidity
function withdraw(uint256 positionId, uint256 assetCode, uint256 count) external
```

_withdraw asset by its position and code (makes all checks)
only position owner_

### withdrawTo

```solidity
function withdrawTo(uint256 positionId, uint256 assetCode, address to, uint256 count) external
```

_withdraws asset to specific address
only position owner_

### withdrawInternal

```solidity
function withdrawInternal(struct ItemRef asset, address to, uint256 count) external
```

_internal withdraw asset for algorithms
onlyPositionAlgorithm_

### transferToAnotherAssetInternal

```solidity
function transferToAnotherAssetInternal(struct ItemRef from, struct ItemRef to, uint256 count) external
```

_transfers asset to another same type asset
onlyPositionAlgorithm_

### count

```solidity
function count(struct ItemRef asset) external view returns (uint256)
```

_returns the count of the asset_

### getCounts

```solidity
function getCounts(uint256 positionId) external view returns (uint256, uint256)
```

_returns all counts of the position
useful for get snapshot for same algorithms_

### positionLocked

```solidity
function positionLocked(uint256 positionId) external view returns (bool)
```

_if returns true than position is locked_

