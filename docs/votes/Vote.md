# Solidity API

## Vote

### _newVoteEtherPrice

```solidity
uint256 _newVoteEtherPrice
```

### _newVoteERC20Price

```solidity
uint256 _newVoteERC20Price
```

### _voteTimer

```solidity
uint256 _voteTimer
```

### _erc20

```solidity
contract IERC20 _erc20
```

### _votesCount

```solidity
uint256 _votesCount
```

### _votes

```solidity
mapping(uint256 => struct VoteData) _votes
```

### _userVotes

```solidity
mapping(uint256 => mapping(address => uint8)) _userVotes
```

### _userClaims

```solidity
mapping(uint256 => mapping(address => bool)) _userClaims
```

### constructor

```solidity
constructor(address erc20Address_) public
```

### erc20Address

```solidity
function erc20Address() external view returns (address)
```

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

### startVote

```solidity
function startVote(address owner) external payable returns (uint256)
```

_starts new vote and returns its ID
onlyFactory_

### vote

```solidity
function vote(uint256 voteId, bool voteValue) external
```

_makes vote_

### userVote

```solidity
function userVote(uint256 voteId, address) external view returns (uint256)
```

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

### _voteLapsedSeconds

```solidity
function _voteLapsedSeconds(struct VoteData data) internal view returns (uint256)
```

### _isVoteEnd

```solidity
function _isVoteEnd(struct VoteData data) internal view returns (bool)
```

### canExecute

```solidity
function canExecute(uint256 voteId) external view returns (bool)
```

_if true than vote can be executed_

### _canExecute

```solidity
function _canExecute(uint256 voteId) internal view returns (bool)
```

### execute

```solidity
function execute(uint256 voteId) external
```

_executes the vote (if ended and win and not yet executed)_

### _getExistingVote

```solidity
function _getExistingVote(uint256 voteId) internal view returns (struct VoteData)
```

### newVoteEtherPrice

```solidity
function newVoteEtherPrice() external view returns (uint256)
```

_new vote ethers fee_

### newVoteErc20Price

```solidity
function newVoteErc20Price() external view returns (uint256)
```

### canClaim

```solidity
function canClaim(uint256 voteId, address account) external view returns (bool)
```

_returns true if account can claim reward after vote_

### _canClaim

```solidity
function _canClaim(uint256 voteId, struct VoteData data, address account) internal view returns (bool)
```

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

### voteErc20RewardCount

```solidity
function voteErc20RewardCount(uint256 voteId) external view returns (uint256)
```

### _voteEtherRewardCount

```solidity
function _voteEtherRewardCount(struct VoteData data) internal view returns (uint256)
```

### _voteErc20RewardCount

```solidity
function _voteErc20RewardCount(struct VoteData data) internal view returns (uint256)
```

### _sendEther

```solidity
function _sendEther(address to, uint256 etherValue) internal
```

