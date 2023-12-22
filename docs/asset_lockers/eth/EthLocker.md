# Solidity API

## EthLocker

### _positions

```solidity
mapping(uint256 => struct EthLockData) _positions
```

### constructor

```solidity
constructor(address feeSettingsAddress) public
```

### position

```solidity
function position(uint256 id) external view returns (struct EthLockData)
```

returns the locked position data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct EthLockData | EthLockData the locked position data |

### withdrawer

```solidity
function withdrawer(uint256 id) external view returns (address)
```

the address with withdraw right for position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | address the address with withdraw right for position |

### unlockTime

```solidity
function unlockTime(uint256 id) external view returns (uint256)
```

time when the position will be unlocked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 linux epoh time, when unlock or 0 if lock permanently |

### withdrawed

```solidity
function withdrawed(uint256 id) external view returns (bool)
```

if true than position is already withdrawed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if position is withdrawed |

### _setWithdrawed

```solidity
function _setWithdrawed(uint256 id) internal
```

_internal sets position as withdrawed to prevent re-withdrawal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

### lockTimeFor

```solidity
function lockTimeFor(uint256 unlockTime_, address withdrawer_) external payable
```

### lockTime

```solidity
function lockTime(uint256 unlockTime_) external payable
```

### lockSecondsFor

```solidity
function lockSecondsFor(uint256 seconds_, address withdrawer_) external payable
```

### lockSeconds

```solidity
function lockSeconds(uint256 seconds_) external payable
```

locks the ethereum, that can be withdrawed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| seconds_ | uint256 | lock seconds |

### _withdraw

```solidity
function _withdraw(uint256 id) internal
```

_internal withdraw algorithm, asset speciffic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

