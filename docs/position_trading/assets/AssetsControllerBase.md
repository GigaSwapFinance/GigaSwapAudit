# Solidity API

## AssetsControllerBase

### _positionsController

```solidity
contract IPositionsController _positionsController
```

### _suppressNotifyListener

```solidity
mapping(uint256 => bool) _suppressNotifyListener
```

### _counts

```solidity
mapping(uint256 => uint256) _counts
```

### _algorithms

```solidity
mapping(uint256 => address) _algorithms
```

### constructor

```solidity
constructor(address positionsController_) internal
```

### onlyOwner

```solidity
modifier onlyOwner(uint256 assetId)
```

### onlyFactory

```solidity
modifier onlyFactory()
```

### onlyBuildMode

```solidity
modifier onlyBuildMode(uint256 assetId)
```

### onlyPositionsController

```solidity
modifier onlyPositionsController()
```

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

### getPositionId

```solidity
function getPositionId(uint256 assetId) external view returns (uint256)
```

_returns the position id by asset id_

### getAlgorithm

```solidity
function getAlgorithm(uint256 assetId) external view returns (address)
```

_the algorithm of the asset that controls it_

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

### transferToAsset

```solidity
function transferToAsset(struct AssetTransferData arg) external payable returns (uint256 ethSurplus)
```

_transfers to current asset from specific account
returns ethereum surplus sent back to the sender
onlyPositionsController_

### addCount

```solidity
function addCount(uint256 assetId, uint256 count_) external
```

### removeCount

```solidity
function removeCount(uint256 assetId, uint256 count_) external
```

### withdraw

```solidity
function withdraw(uint256 assetId, address recipient, uint256 count_) external
```

### _withdraw

```solidity
function _withdraw(uint256 assetId, address recipient, uint256 count) internal virtual
```

### count

```solidity
function count(uint256 assetId) external view returns (uint256)
```

_asset count_

### _transferToAsset

```solidity
function _transferToAsset(uint256 assetId, address from, uint256 count) internal virtual returns (uint256 countTransferred, uint256 ethConsumed)
```

### getData

```solidity
function getData(uint256 assetId) external view returns (struct AssetData)
```

_returns the full assets data_

### getCode

```solidity
function getCode(uint256 assetId) external view returns (uint256)
```

_returns the asset code 1 or 2_

