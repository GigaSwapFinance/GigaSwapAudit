# Solidity API

## VoteExecutorBase

### vote

```solidity
contract IVote vote
```

### writer

```solidity
address writer
```

### constructor

```solidity
constructor(address voteAddress, address writerAddress) internal
```

### onlyVote

```solidity
modifier onlyVote()
```

### _startVote

```solidity
function _startVote(uint256 value, address surplusRevertAddress) internal returns (uint256 voteId, uint256 surplus)
```

### execute

```solidity
function execute(uint256 voteId) external
```

executes the vote

### _execute

```solidity
function _execute(uint256 voteId) internal virtual
```

