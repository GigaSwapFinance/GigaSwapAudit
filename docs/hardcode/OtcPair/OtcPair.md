# Solidity API

## Pair

```solidity
struct Pair {
  contract IERC20 asset1;
  contract IERC20 asset2;
  uint256 count1;
  uint256 count2;
}
```

## OtcPair

### _pairs

```solidity
mapping(uint256 => struct Pair) _pairs
```

### _pairsCount

```solidity
uint256 _pairsCount
```

### OnCreatePair

```solidity
event OnCreatePair(uint256 pairId, struct Pair pair)
```

### OnSwap

```solidity
event OnSwap(uint256 pairId, uint256 lastCount1, uint256 lastCount2, uint256 newCount1, uint256 newCount2)
```

### createPair

```solidity
function createPair(address asset1, address asset2, uint256 count1, uint256 count2) external
```

### getPair

```solidity
function getPair(uint256 pairId) external view returns (struct Pair)
```

### buy2ForCertain1

```solidity
function buy2ForCertain1(uint256 positionId, uint256 asset1Count) external
```

### _getBuyCount

```solidity
function _getBuyCount(uint256 inputLastCount, uint256 inputNewCount, uint256 outputLastCount) internal pure returns (uint256)
```

