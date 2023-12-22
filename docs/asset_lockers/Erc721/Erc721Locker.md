# Solidity API

## Erc721Locker

### _positions

```solidity
mapping(uint256 => struct Erc721LockData) _positions
```

### constructor

```solidity
constructor(address feeSettingsAddress) public
```

### position

```solidity
function position(uint256 id) external view returns (struct Erc721LockData)
```

returns the locked position data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Erc721LockData | Erc721LockData the locked position data |

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

### lockPermanent

```solidity
function lockPermanent(address token, uint256[] items) external
```

permanent locks the tokens. It can not be withdrawed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| items | uint256[] | items to lock |

### lockTimeFor

```solidity
function lockTimeFor(address token, uint256[] items, uint256 unlockTime_, address withdrawer_) external
```

### lockTime

```solidity
function lockTime(address token, uint256[] items, uint256 unlockTime_) external
```

### lockSecondsFor

```solidity
function lockSecondsFor(address token, uint256[] items, uint256 seconds_, address withdrawer_) external
```

### lockSeconds

```solidity
function lockSeconds(address token, uint256[] items, uint256 seconds_) external
```

locks the token, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| items | uint256[] | token items to lock |
| seconds_ | uint256 | seconds for lock |

### _withdraw

```solidity
function _withdraw(uint256 id) internal
```

_internal withdraw algorithm, asset speciffic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

