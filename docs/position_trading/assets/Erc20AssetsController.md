# Solidity API

## Erc20AssetsController

### _contracts

```solidity
mapping(uint256 => contract IERC20) _contracts
```

### constructor

```solidity
constructor(address positionsController) public
```

### assetTypeId

```solidity
function assetTypeId() external pure returns (uint256)
```

_returns the asset type code (also used to check asset interface support)_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 1-eth 2-erc20 3-erc721Item 4-Erc721Count |

### initialize

```solidity
function initialize(address from, uint256 assetId, struct AssetCreationData data) external payable returns (uint256 ethSurplus)
```

_initializes the asset by its data
onlyBuildMode_

### value

```solidity
function value(uint256) external pure returns (uint256)
```

### contractAddr

```solidity
function contractAddr(uint256 assetId) external view returns (address)
```

_the address of the contract that is wrapped in the asset_

### clone

```solidity
function clone(uint256 assetId, address owner) external returns (struct ItemRef)
```

_creates a copy of the current asset, with 0 count and the specified owner_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct ItemRef | uint256 new asset reference |

### _withdraw

```solidity
function _withdraw(uint256 assetId, address recipient, uint256 count) internal
```

### _transferToAsset

```solidity
function _transferToAsset(uint256 assetId, address from, uint256 count) internal returns (uint256 countTransferred, uint256 ethConsumed)
```

