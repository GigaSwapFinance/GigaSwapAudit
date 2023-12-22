# Solidity API

## IPositionAlgorithm

### checkCanWithdraw

```solidity
function checkCanWithdraw(struct ItemRef asset, uint256 assetCode, uint256 count) external view
```

_if asset can not be withdraw - revert_

### positionLocked

```solidity
function positionLocked(uint256 positionId) external view returns (bool)
```

_if true than position is locked and can not withdraw_

### lockPosition

```solidity
function lockPosition(uint256 positionId, uint256 lockSeconds) external
```

_locks the position
only position owner_

