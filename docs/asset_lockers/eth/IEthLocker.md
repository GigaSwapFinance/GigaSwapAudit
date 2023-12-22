# Solidity API

## IEthLocker

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

