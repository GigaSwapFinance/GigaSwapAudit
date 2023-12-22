# Solidity API

## EthLockData

```solidity
struct EthLockData {
  address withdrawer;
  uint256 unlockTime;
  bool withdrawed;
  uint256 count;
  uint256 fee;
}
```

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
function position(uint256 id) public view returns (struct EthLockData)
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
function withdrawer(uint256 id) public view returns (address)
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
function unlockTime(uint256 id) public view returns (uint256)
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
function withdrawed(uint256 id) public view returns (bool)
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

### lock

```solidity
function lock(uint256 unlockTime, address withdrawer) external payable
```

locks the ethereum, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |
| withdrawer | address | the address with withdraw right for position |

### lock

```solidity
function lock(uint256 unlockTime) external payable
```

locks the ethereum, that can be withdraw by caller address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |

### _withdraw

```solidity
function _withdraw(uint256 id) internal
```

_internal withdraw algorithm, asset speciffic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

