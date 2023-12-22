# Solidity API

## Stack

```solidity
struct Stack {
  uint256 count;
  uint256 creationInterval;
}
```

## IFarming

### OnAddStack

```solidity
event OnAddStack(address account, struct Stack stack, uint256 count)
```

_account added stack count_

### OnRemoveStack

```solidity
event OnRemoveStack(address account, struct Stack stack, uint256 count)
```

_account removed stack count_

### OnClaimEth

```solidity
event OnClaimEth(address account, struct Stack stack, uint256 count)
```

_account claimed eth_

### OnClaimErc20

```solidity
event OnClaimErc20(address account, struct Stack stack, uint256 count)
```

_account claimed erc20_

### OnNextInterval

```solidity
event OnNextInterval(uint256 interval)
```

_next interval_

### timeIntervalLength

```solidity
function timeIntervalLength() external view returns (uint256)
```

_the intervals time length_

### setTimeIntervalLengthHours

```solidity
function setTimeIntervalLengthHours(uint256 intervalHours) external
```

_sets time interval number in hours
onlyOwner_

### intervalNumber

```solidity
function intervalNumber() external view returns (uint256)
```

_current interval number_

### nextIntervalTime

```solidity
function nextIntervalTime() external view returns (uint256)
```

_time of next interval. Can be less then current time if if next Interval is already started, but no one write function has been at new interval_

### nextIntervalLapsedSeconds

```solidity
function nextIntervalLapsedSeconds() external view returns (uint256)
```

_next interval lapsed seconds or 0 if next Interval is already started, but no one write function has been at new interval_

### getStack

```solidity
function getStack(address account) external view returns (struct Stack)
```

_returns the accounts stack_

### addStack

```solidity
function addStack(uint256 count) external returns (struct Stack)
```

_adds the accounts stack_

### addFullStack

```solidity
function addFullStack() external returns (struct Stack)
```

_adds the caller all fee tokens to stack_

### removeStack

```solidity
function removeStack(uint256 count) external returns (struct Stack)
```

_removes the accounts stack_

### removeFullStack

```solidity
function removeFullStack() external returns (struct Stack)
```

_removes the caller all fee tokens from stack_

### totalStacks

```solidity
function totalStacks() external view returns (uint256)
```

_total stacks erc20 count_

### totalStacksOnInterval

```solidity
function totalStacksOnInterval() external view returns (uint256)
```

_returns the total fee tokens stacked at current interval_

### ethTotalForRewards

```solidity
function ethTotalForRewards() external view returns (uint256)
```

_returns total eth for rewards_

### erc20TotalForRewards

```solidity
function erc20TotalForRewards(address erc20) external view returns (uint256)
```

_returns total erc20 for rewards_

### ethOnInterval

```solidity
function ethOnInterval() external view returns (uint256)
```

_returns total eth at current interval_

### erc20OnInterval

```solidity
function erc20OnInterval(address erc20) external view returns (uint256)
```

_returns total erc20 at current interval_

### ethClaimIntervalForAccount

```solidity
function ethClaimIntervalForAccount(address account) external view returns (uint256)
```

_the interval from which an account can claim ethereum rewards
sets to next interval if add stack or claim eth_

### erc20ClaimIntervalForAccount

```solidity
function erc20ClaimIntervalForAccount(address account, address erc20) external view returns (uint256)
```

_the interval from which an account can claim erc20 rewards
sets to next interval if add stack or claim eth_

### ethClaimCountForAccount

```solidity
function ethClaimCountForAccount(address account) external view returns (uint256)
```

_returns eth that would be claimed by account at current time_

### erc20ClaimCountForAccount

```solidity
function erc20ClaimCountForAccount(address account, address erc20) external view returns (uint256)
```

_returns erc20 that would be claimed by account at current time_

### ethClaimCountForAccountExpect

```solidity
function ethClaimCountForAccountExpect(address account) external view returns (uint256)
```

_returns expected eth that would be claimed by account at current time (on all intervals)_

### erc20ClaimCountForAccountExpect

```solidity
function erc20ClaimCountForAccountExpect(address account, address erc20) external view returns (uint256)
```

_returns expected erc20 that would be claimed by account at current time (on all intervals)_

### ethClaimCountForStackExpect

```solidity
function ethClaimCountForStackExpect(uint256 stackSize) external view returns (uint256)
```

_returns expected eth claim count for stack size at current time (on all intervals)_

### erc20ClaimCountForStackExpect

```solidity
function erc20ClaimCountForStackExpect(uint256 stackSize, address erc20) external view returns (uint256)
```

_returns expected erc20 that would be claimed for stack size at current time (on all intervals)_

### ethClaimCountForNewStackExpect

```solidity
function ethClaimCountForNewStackExpect(uint256 stackSize) external view returns (uint256)
```

_returns expected eth claim count for new stack size at current time (on all intervals)_

### erc20ClaimCountForNewStackExpect

```solidity
function erc20ClaimCountForNewStackExpect(uint256 stackSize, address erc20) external view returns (uint256)
```

_returns expected erc20 that would be claimed for new stack size at current time (on all intervals)_

### ethClaimCountForStack

```solidity
function ethClaimCountForStack(uint256 stackSize) external view returns (uint256)
```

_returns eth claim count for stack on interval_

### erc20ClaimCountForStack

```solidity
function erc20ClaimCountForStack(uint256 stackSize, address erc20) external view returns (uint256)
```

_returns erc20 that would be claimed for stack size at current time_

### claimEth

```solidity
function claimEth() external
```

_claims ethereum_

### claimErc20

```solidity
function claimErc20(address erc20) external
```

_claims certain erc20_

### batchClaim

```solidity
function batchClaim(bool claimEth, address[] tokens) external
```

_batch claim ethereum and or erc20 tokens_

