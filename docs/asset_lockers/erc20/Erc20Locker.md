# Solidity API

## Erc20Locker

### _positions

```solidity
mapping(uint256 => struct Erc20LockData) _positions
```

### constructor

```solidity
constructor(address feeSettingsAddress) public
```

### position

```solidity
function position(uint256 id) external view returns (struct Erc20LockData)
```

returns the locked position data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Erc20LockData | Erc20LockData the locked position data |

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

### _isLocked

```solidity
function _isLocked(uint256 id) internal view returns (bool)
```

### unlockTime

```solidity
function unlockTime(uint256 id) external view returns (uint256)
```

time when the position will be unlocked (only full unlock)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 linux epoh time, when unlock or 0 if lock permanently |

### unlockAllTime

```solidity
function unlockAllTime(uint256 id) external view returns (uint256)
```

the unlock all time

### remainingTokensToWithdraw

```solidity
function remainingTokensToWithdraw(uint256 id) external view returns (uint256)
```

remaining tokens for withdraw

### _remainingTokensToWithdraw

```solidity
function _remainingTokensToWithdraw(uint256 id) internal view returns (uint256)
```

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
function lockTimeFor(address token, uint256 count, uint256 unlockTime_, address withdrawer_) external
```

### lockTime

```solidity
function lockTime(address token, uint256 count, uint256 unlockTime_) external
```

### lockSecondsFor

```solidity
function lockSecondsFor(address token, uint256 count, uint256 seconds_, address withdrawer_) external
```

### lockSeconds

```solidity
function lockSeconds(address token, uint256 count, uint256 seconds_) external
```

locks the token, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| count | uint256 | token count without decimals |
| seconds_ | uint256 | seconds for lock |

### lockStepByStepUnlocking

```solidity
function lockStepByStepUnlocking(address tokenAddress, uint256 count, address withdrawer_, uint256 interval, uint256 stepByStepUnlockCount) external
```

### _lock

```solidity
function _lock(address tokenAddress, uint256 count, address withdrawer_, uint256 interval, uint256 stepByStepUnlockCount) internal
```

### _withdraw

```solidity
function _withdraw(uint256 id) internal
```

_internal withdraw algorithm, asset speciffic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

### unlockedCount

```solidity
function unlockedCount(uint256 id) external view returns (uint256)
```

unlocked tokens count. All unlocked tokens.(withdrawen and not)

### _unlockedCount

```solidity
function _unlockedCount(uint256 id) internal view returns (uint256)
```

### unlockedCountWithdrawAvailable

```solidity
function unlockedCountWithdrawAvailable(uint256 id) external view returns (uint256)
```

unlocked tokens count. Available for withdraw

### _unlockedCountWithdrawAvailable

```solidity
function _unlockedCountWithdrawAvailable(uint256 id) internal view returns (uint256)
```

