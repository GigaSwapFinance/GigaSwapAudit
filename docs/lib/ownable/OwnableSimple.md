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

### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

