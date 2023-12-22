# Solidity API

## Erc20Info

```solidity
struct Erc20Info {
  uint256 intervalNumber;
  uint256 totalCountOnInterval;
}
```

## Farming

### _stackingContract

```solidity
contract IERC20 _stackingContract
```

### _stacks

```solidity
mapping(address => struct Stack) _stacks
```

### _timeIntervalFirst

```solidity
uint256 _timeIntervalFirst
```

### _timeInterval

```solidity
uint256 _timeInterval
```

### _nextIntervalTime

```solidity
uint256 _nextIntervalTime
```

### _intervalNumber

```solidity
uint256 _intervalNumber
```

### _totalStacksOnInterval

```solidity
uint256 _totalStacksOnInterval
```

### _totalStacks

```solidity
uint256 _totalStacks
```

### _totalEthOnInterval

```solidity
uint256 _totalEthOnInterval
```

### _erc20infos

```solidity
mapping(address => struct Erc20Info) _erc20infos
```

### _ethClaimIntervals

```solidity
mapping(address => uint256) _ethClaimIntervals
```

### _erc20ClaimIntervals

```solidity
mapping(address => mapping(address => uint256)) _erc20ClaimIntervals
```

### constructor

```solidity
constructor(address stackingContract) public
```

### receive

```solidity
receive() external payable
```

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

### _completedIntervals

```solidity
function _completedIntervals() internal view returns (uint256)
```

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

### _addStack

```solidity
function _addStack(uint256 count) internal returns (struct Stack)
```

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

### _removeStack

```solidity
function _removeStack(uint256 count) internal returns (struct Stack)
```

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

### _expectedErc20Info

```solidity
function _expectedErc20Info(address erc20, uint256 expectedIntervalNumber) internal view returns (struct Erc20Info)
```

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

### _claimCountForStack

```solidity
function _claimCountForStack(uint256 stackCount, uint256 totalStacksOnInterval_, uint256 assetCountOnInterval) internal pure returns (uint256)
```

### erc20ClaimForStack

```solidity
function erc20ClaimForStack(address erc20, uint256 stackCount) external view returns (uint256)
```

### _nextInterval

```solidity
function _nextInterval() internal returns (bool)
```

### claimEth

```solidity
function claimEth() external
```

_claims ethereum_

### _claimEth

```solidity
function _claimEth() internal
```

### claimErc20

```solidity
function claimErc20(address erc20) external
```

_claims certain erc20_

### _claimErc20

```solidity
function _claimErc20(address erc20) internal
```

### batchClaim

```solidity
function batchClaim(bool claimEth_, address[] tokens) external
```

