# Solidity API

## ITradingPairFeeDistributer

_the fee rewards distributer interface_

### OnLock

```solidity
event OnLock(address account, uint256 amount)
```

_the lock event_

### OnUnlock

```solidity
event OnUnlock(address account, uint256 amount)
```

_the unlock event_

### OnClaim

```solidity
event OnClaim(address account, uint256 asset1Count, uint256 asset2Count)
```

_the claim event_

### lockFeeTokens

```solidity
function lockFeeTokens(uint256 amount) external
```

_locks the certain amount of tokens_

### unlockFeeTokens

```solidity
function unlockFeeTokens(uint256 amount) external
```

_unlocks certain amount of tokens_

### totalFeeTokensLocked

```solidity
function totalFeeTokensLocked() external view returns (uint256)
```

_the total number of fee tokens locked_

### currentRoundBeginingTotalFeeTokensLocked

```solidity
function currentRoundBeginingTotalFeeTokensLocked() external view returns (uint256)
```

_tokens locked at the beginning of the current round_

### asset1ToDistributeCurrentRound

```solidity
function asset1ToDistributeCurrentRound() external view returns (uint256)
```

_the asset1 to distribute at current fee round_

### asset2ToDistributeCurrentRound

```solidity
function asset2ToDistributeCurrentRound() external view returns (uint256)
```

_the asset2 to distribute at current fee round_

### assetsToDistributeCurrentRound

```solidity
function assetsToDistributeCurrentRound() external view returns (uint256, uint256)
```

_the assets to distribute at current fee round_

### asset1DistributedTotal

```solidity
function asset1DistributedTotal() external view returns (uint256)
```

_the asset1 total distributed counts for statistics_

### asset2DistributedTotal

```solidity
function asset2DistributedTotal() external view returns (uint256)
```

_the asset1 total distributed counts for statistics_

### assetsDistributedTotal

```solidity
function assetsDistributedTotal() external view returns (uint256, uint256)
```

_the assets total distributed counts for statistics_

### getClaimRound

```solidity
function getClaimRound(address account) external view returns (uint256)
```

_returns the number of the last round in which the account received a reward_

### getLock

```solidity
function getLock(address account) external view returns (uint256)
```

_returns the account amount of tokens lock_

### getExpectedRewardForAccount

```solidity
function getExpectedRewardForAccount(address account) external view returns (uint256, uint256)
```

_returns current time rewards counts for specific account_

### getExpectedRewardForAccountNextRound

```solidity
function getExpectedRewardForAccountNextRound(address account) external view returns (uint256, uint256)
```

_current reward for account current stack
this value may be decrease (if claimed rewards or added stacks) or increase (if fee arrives)_

### getExpectedRewardForTokensCount

```solidity
function getExpectedRewardForTokensCount(uint256 feeTokensCount) external view returns (uint256, uint256)
```

_reward for tokens count_

### getExpectedRewardForTokensCountNextRound

```solidity
function getExpectedRewardForTokensCountNextRound(uint256 feeTokensCount) external view returns (uint256, uint256)
```

_current reward for tokens count on next round
this value may be decrease (if claimed rewards or added stacks) or increase (if fee arrives)_

### claimRewards

```solidity
function claimRewards() external
```

_grants rewards to sender_

### feeRoundInterval

```solidity
function feeRoundInterval() external view returns (uint256)
```

_returns the time between the fee rounds_

### feeRoundNumber

```solidity
function feeRoundNumber() external view returns (uint256)
```

_returns the current fee round number_

### nextFeeRoundLapsedMinutes

```solidity
function nextFeeRoundLapsedMinutes() external view returns (uint256)
```

_remaining minutes until the next fee round_

### nextFeeRoundLapsedTime

```solidity
function nextFeeRoundLapsedTime() external view returns (uint256)
```

_remaining time until next fee round_

### nextFeeRoundTime

```solidity
function nextFeeRoundTime() external view returns (uint256)
```

_the time when available transfer the system to next fee round
this transfer happens automatically when call any write function_

### tryNextFeeRound

```solidity
function tryNextFeeRound() external
```

_transfers the system into next fee round.
this is technical function, available for everyone.
despite this happens automatically when call any write function, sometimes it can be useful to scroll the state manually_

### asset

```solidity
function asset(uint256 assetCode) external view returns (struct ItemRef)
```

_returns the fee asset reference_

### assetCount

```solidity
function assetCount(uint256 assetCode) external view returns (uint256)
```

_returns the fee asset count_

### allAssetsCounts

```solidity
function allAssetsCounts() external view returns (uint256 asset1Count, uint256 asset2Count)
```

_returns the all fee assets counts_

### tradingPair

```solidity
function tradingPair() external view returns (address)
```

_the trading pair algorithm contract_

### positionId

```solidity
function positionId() external view returns (uint256)
```

_the position id_

