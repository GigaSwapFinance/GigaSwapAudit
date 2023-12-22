# Solidity API

## IErc721Locker

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

### lock

```solidity
function lock(uint256 unlockTime, address withdrawer, uint256[] items) external payable
```

locks the ethereum, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |
| withdrawer | address | the address with withdraw right for position |
| items | uint256[] | token items to lock |

### lock

```solidity
function lock(uint256 unlockTime, uint256[] items) external payable
```

locks the items, that can be withdraw by caller address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| unlockTime | uint256 | token unlock time or 0 if permanent lock |
| items | uint256[] | token items to lock |

