# Solidity API

## PacketErc20

### _balances

```solidity
mapping(address => mapping(address => uint256)) _balances
```

### _stacks

```solidity
mapping(address => mapping(address => struct Stack[])) _stacks
```

### addStack

```solidity
function addStack(address account, address tokenAddress, uint256 count, uint256 claimTimer) external
```

_adds tokens stack for account_

### balance

```solidity
function balance(address account, address tokenAddress) external view returns (uint256)
```

_balance of account (include all accounts stacks)_

### claimCount

```solidity
function claimCount(address account, address tokenAddress) external view returns (uint256)
```

_claim count for account on current time (includes stacks can be claimed at moment only)_

### stacks

```solidity
function stacks(address account, address tokenAddress) external view returns (struct Stack[])
```

_returns all stacks of account_

### claim

```solidity
function claim(address tokenAddress) external
```

_claims all stacks, that can be claimet at monment_

