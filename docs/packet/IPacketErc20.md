# Solidity API

## Stack

```solidity
struct Stack {
  uint256 claimTime;
  uint256 count;
}
```

## IPacketErc20

### OnAddStack

```solidity
event OnAddStack(address account, address tokenAddress, uint256 count, uint256 claimTime)
```

_on new stack_

### OnClaim

```solidity
event OnClaim(address account, address tokenAddress, uint256 count)
```

_on claim token_

### addStack

```solidity
function addStack(address account, address tokenAddress, uint256 count, uint256 claimTimer) external
```

_adds tokens stack for account_

### stacks

```solidity
function stacks(address account, address tokenAddress) external view returns (struct Stack[])
```

_returns all stacks of account_

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

### claim

```solidity
function claim(address tokenAddress) external
```

_claims all stacks, that can be claimet at monment_

