# Solidity API

## ItemRefAsAssetLibrary

_item reference as asset wrapper functions_

### assetsController

```solidity
function assetsController(struct ItemRef ref) internal pure returns (contract IAssetsController)
```

### assetTypeId

```solidity
function assetTypeId(struct ItemRef ref) internal pure returns (uint256)
```

### count

```solidity
function count(struct ItemRef ref) internal view returns (uint256)
```

### addCount

```solidity
function addCount(struct ItemRef ref, uint256 countToAdd) internal
```

### removeCount

```solidity
function removeCount(struct ItemRef ref, uint256 countToRemove) internal
```

### withdraw

```solidity
function withdraw(struct ItemRef ref, address recipient, uint256 cnt) internal
```

### getPositionId

```solidity
function getPositionId(struct ItemRef ref) internal view returns (uint256)
```

### clone

```solidity
function clone(struct ItemRef ref, address owner) internal returns (struct ItemRef)
```

### setNotifyListener

```solidity
function setNotifyListener(struct ItemRef ref, bool value) internal
```

### initialize

```solidity
function initialize(struct ItemRef ref, address from, struct AssetCreationData data) internal
```

### getData

```solidity
function getData(struct ItemRef ref) internal view returns (struct AssetData data)
```

### getCode

```solidity
function getCode(struct ItemRef ref) internal view returns (uint256)
```

### contractAddr

```solidity
function contractAddr(struct ItemRef ref) internal view returns (address)
```

### estimateDecimals

```solidity
function estimateDecimals(struct ItemRef ref) internal view returns (uint8)
```

estimates decimals for internal purposes (such as calculations of liquidity tokens decimals)

