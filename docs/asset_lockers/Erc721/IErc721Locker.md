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
function lockTimeFor(address token, uint256[] items, uint256 unlockTime, address withdrawer) external
```

locks the tokens, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| items | uint256[] | items to lock |
| unlockTime | uint256 | token unlock time |
| withdrawer | address | the address with withdraw right for position |

### lockTime

```solidity
function lockTime(address token, uint256[] items, uint256 unlockTime) external
```

locks the tokens, that can be withdraw by caller address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| items | uint256[] | items to lock |
| unlockTime | uint256 | token unlock time |

### lockSecondsFor

```solidity
function lockSecondsFor(address token, uint256[] items, uint256 seconds_, address withdrawer) external
```

locks the token, that can be withdrawed by certait address

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | token address |
| items | uint256[] | token items to lock |
| seconds_ | uint256 | seconds for lock |
| withdrawer | address | the address with withdraw right for position |

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

