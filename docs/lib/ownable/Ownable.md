# Solidity API

## Ownable

### _owner

```solidity
address _owner
```

### constructor

```solidity
constructor() public
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### owner

```solidity
function owner() external view virtual returns (address)
```

owner of contract

### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

transfers ownership of contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newOwner | address | new owner of contract |

