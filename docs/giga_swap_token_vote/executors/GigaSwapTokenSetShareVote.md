# Solidity API

## Data

```solidity
struct Data {
  uint256 thisSharePpm;
  uint256 stackingSharePpm;
}
```

## GigaSwapTokenSetShareVote

### data

```solidity
mapping(uint256 => struct Data) data
```

### constructor

```solidity
constructor(address voteAddress, address writerAddress) public
```

### startVote

```solidity
function startVote(uint256 thisSharePpm, uint256 stackingSharePpm) external payable
```

starts the vote

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| thisSharePpm | uint256 | new thisSharePpm |
| stackingSharePpm | uint256 | new stackingSharePpm |

### _execute

```solidity
function _execute(uint256 voteId) internal
```

