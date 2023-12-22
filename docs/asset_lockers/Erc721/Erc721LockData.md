# Solidity API

## Erc721LockData

```solidity
struct Erc721LockData {
  address token;
  address withdrawer;
  uint256 unlockTime;
  bool withdrawed;
  uint256[] items;
}
```

