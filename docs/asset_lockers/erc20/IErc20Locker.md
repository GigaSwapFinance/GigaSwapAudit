# Solidity API

## IErc20Locker

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

### lock

```solidity
function lock(address erc20Address, uint256 count, uint256 unlockTime, address withdrawer) external
```

locks the erc20 tokens, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| erc20Address | address | token address |
| count | uint256 | token count without decimals |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |
| withdrawer | address | the address with withdraw right for position |

### lock

```solidity
function lock(address erc20Address, uint256 count, uint256 unlockTime) external
```

locks the erc20 tokens, that can be withdraw by caller address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| erc20Address | address | token address |
| count | uint256 | token count without decimals |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |

