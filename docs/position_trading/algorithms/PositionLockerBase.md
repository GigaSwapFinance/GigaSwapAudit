# Solidity API

## PositionLockerBase

_locks the asset of the position owner for a certain time_

### unlockTimes

```solidity
mapping(uint256 => uint256) unlockTimes
```

### _permanentLocks

```solidity
mapping(uint256 => bool) _permanentLocks
```

### onlyUnlockedPosition

```solidity
modifier onlyUnlockedPosition(uint256 positionId)
```

### onlyLockedPosition

```solidity
modifier onlyLockedPosition(uint256 positionId)
```

### positionLocked

```solidity
function positionLocked(uint256 positionId) external view returns (bool)
```

### _positionLocked

```solidity
function _positionLocked(uint256 positionId) internal view virtual returns (bool)
```

### isPermanentLock

```solidity
function isPermanentLock(uint256 positionId) external view returns (bool)
```

### _isPermanentLock

```solidity
function _isPermanentLock(uint256 positionId) internal view virtual returns (bool)
```

### lapsedLockSeconds

```solidity
function lapsedLockSeconds(uint256 positionId) external view returns (uint256)
```

