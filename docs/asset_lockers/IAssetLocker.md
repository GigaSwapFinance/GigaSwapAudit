# Solidity API

## IAssetLocker

### OnLockPosition

```solidity
event OnLockPosition(uint256 id)
```

new position locked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of new locked position |

### OnWithdraw

```solidity
event OnWithdraw(uint256 id)
```

position withdrawed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of new locked position |

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

### withdraw

```solidity
function withdraw(uint256 id) external
```

withdraws the position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id of position |

