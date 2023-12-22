# Solidity API

## IAssetsController

### initialize

```solidity
function initialize(address from, uint256 assetId, struct AssetCreationData data) external payable returns (uint256 ethSurplus)
```

_initializes the asset by its data
onlyBuildMode_

### algorithm

```solidity
function algorithm(uint256 assetId) external view returns (address)
```

_algorithm-controller address_

### positionsController

```solidity
function positionsController() external view returns (address)
```

_positions controller_

### assetTypeId

```solidity
function assetTypeId() external pure returns (uint256)
```

_returns the asset type code (also used to check asset interface support)_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 1-eth 2-erc20 3-erc721Item 4-Erc721Count |

### getPositionId

```solidity
function getPositionId(uint256 assetId) external view returns (uint256)
```

_returns the position id by asset id_

### getAlgorithm

```solidity
function getAlgorithm(uint256 assetId) external view returns (address algorithm)
```

_the algorithm of the asset that controls it_

### getCode

```solidity
function getCode(uint256 assetId) external view returns (uint256)
```

_returns the asset code 1 or 2_

### count

```solidity
function count(uint256 assetId) external view returns (uint256)
```

_asset count_

### value

```solidity
function value(uint256 assetId) external view returns (uint256)
```

_external value of the asset (nft token id for example)_

### contractAddr

```solidity
function contractAddr(uint256 assetId) external view returns (address)
```

_the address of the contract that is wrapped in the asset_

### getData

```solidity
function getData(uint256 assetId) external view returns (struct AssetData)
```

_returns the full assets data_

### withdraw

```solidity
function withdraw(uint256 assetId, address recipient, uint256 count) external
```

_withdraw the asset_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetId | uint256 |  |
| recipient | address | recipient of asset |
| count | uint256 | count to withdraw onlyPositionsController or algorithm |

### addCount

```solidity
function addCount(uint256 assetId, uint256 count) external
```

_add count to asset
onlyPositionsController_

### removeCount

```solidity
function removeCount(uint256 assetId, uint256 count) external
```

_remove asset count
onlyPositionsController_

### transferToAsset

```solidity
function transferToAsset(struct AssetTransferData arg) external payable returns (uint256 ethSurplus)
```

_transfers to current asset from specific account
returns ethereum surplus sent back to the sender
onlyPositionsController_

### clone

```solidity
function clone(uint256 assetId, address owner) external returns (struct ItemRef)
```

_creates a copy of the current asset, with 0 count and the specified owner_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct ItemRef | uint256 new asset reference |

### owner

```solidity
function owner(uint256 assetId) external view returns (address)
```

_owner of the asset_

### isNotifyListener

```solidity
function isNotifyListener(uint256 assetId) external view returns (bool)
```

_if true, then asset notifies its observer (owner)_

### setNotifyListener

```solidity
function setNotifyListener(uint256 assetId, bool value) external
```

_enables or disables the observer notification mechanism
only factories_

