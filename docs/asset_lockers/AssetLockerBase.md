# Solidity API

## AssetLockerBase

### _positionsCount

```solidity
uint256 _positionsCount
```

total created positions count

### _feeSettings

```solidity
contract IFeeSettings _feeSettings
```

tax system contract

### constructor

```solidity
constructor(address feeSettingsAddress) internal
```

constructor

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeSettingsAddress | address | tax system contract |

### OnlyExistingPosition

```solidity
modifier OnlyExistingPosition(uint256 positionId)
```

allows only existing positions

### positionsCount

```solidity
function positionsCount() external view returns (uint256)
```

total created positions count

### feeSettings

```solidity
function feeSettings() external view returns (address)
```

returns tax system contract address

### isLocked

```solidity
function isLocked(uint256 id) external view returns (bool)
```

returns true, if position is locked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if locked |

### _isLocked

```solidity
function _isLocked(uint256 id) internal view virtual returns (bool)
```

### isPermanentLock

```solidity
function isPermanentLock(uint256 id) external view returns (bool)
```

returns true if asset locked permanently

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of  position |

### withdraw

```solidity
function withdraw(uint256 id) external
```

withdraws the position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

### _withdraw

```solidity
function _withdraw(uint256 id) internal virtual
```

_internal withdraw algorithm, asset speciffic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

### _setWithdrawed

```solidity
function _setWithdrawed(uint256 id) internal virtual
```

_internal sets position as withdrawed to prevent re-withdrawal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

### _newPositionId

```solidity
function _newPositionId() internal returns (uint256)
```

_returns new position ID_

### _positionExists

```solidity
function _positionExists(uint256 positionId) internal view returns (bool)
```

_returns true, if position is exists_

