# Solidity API

## VoteData

```solidity
struct VoteData {
  address owner;
  uint256 endTime;
  uint256 etherCount;
  uint256 erc20Count;
  uint256 forCount;
  uint256 againstCount;
  bool executed;
  address executor;
}
```

