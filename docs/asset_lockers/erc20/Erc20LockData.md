# Solidity API

## Erc20LockData

```solidity
struct Erc20LockData {
  address token;
  address withdrawer;
  uint256 creationTime;
  uint256 timeInterval;
  uint256 withdrawedCount;
  uint256 count;
  uint256 stepByStepUnlockCount;
}
```

