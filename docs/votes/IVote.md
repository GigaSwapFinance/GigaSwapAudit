# Solidity API

## IVote

### NewVote

```solidity
event NewVote(uint256 voteId, address executor)
```

_new vote created_

### ExecuteVote

```solidity
event ExecuteVote(uint256 voteId, address executor)
```

_execute vote result_

### UserVote

```solidity
event UserVote(uint256 voteId, address executor, address account)
```

_the user make vote_

### totalVotesCount

```solidity
function totalVotesCount() external view returns (uint256)
```

_total votes count_

### getVote

```solidity
function getVote(uint256 id) external view returns (struct VoteData data, bool isEnd)
```

_returns the data of the vote_

### vote

```solidity
function vote(uint256 voteId, bool voteValue) external
```

_makes vote_

### canClaim

```solidity
function canClaim(uint256 voteId, address account) external view returns (bool)
```

_returns true if account can claim reward after vote_

### isClaimed

```solidity
function isClaimed(uint256 voteId, address account) external view returns (bool)
```

_returns true if account claimed reward after vote_

### claim

```solidity
function claim(uint256 voteId) external
```

_claim ether after vote_

### voteEtherRewardCount

```solidity
function voteEtherRewardCount(uint256 voteId) external view returns (uint256)
```

_current vote ether reward_

### startVote

```solidity
function startVote(address owner) external payable returns (uint256)
```

_starts new vote and returns its ID
onlyFactory_

### isVoteEnd

```solidity
function isVoteEnd(uint256 voteId) external view returns (bool)
```

_returns true if vote time is end_

### voteLapsedSeconds

```solidity
function voteLapsedSeconds(uint256 voteId) external view returns (uint256)
```

_vote lapsed seconds_

### execute

```solidity
function execute(uint256 voteId) external
```

_executes the vote (if ended and win and not yet executed)_

### canExecute

```solidity
function canExecute(uint256 voteId) external view returns (bool)
```

_if true than vote can be executed_

### newVoteEtherPrice

```solidity
function newVoteEtherPrice() external view returns (uint256)
```

_new vote ethers fee_

### userVote

```solidity
function userVote(uint256 voteId, address account) external view returns (uint256)
```

_returns the user vote
0 - has no vote
1 - for
2 - against_

