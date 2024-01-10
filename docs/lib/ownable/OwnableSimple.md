# Solidity API

## OwnableSimple

_ownable, optimized, for dynamically generated contracts_

### _owner

```solidity
address _owner
```

### constructor

```solidity
constructor(address owner_) public
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

