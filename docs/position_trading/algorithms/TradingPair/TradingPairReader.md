# Solidity API

## TradingPairReader

### algorithm

```solidity
contract ITradingPairAlgorithm algorithm
```

### constructor

```solidity
constructor(address algorithm_) public
```

### getTradingPair

```solidity
function getTradingPair(uint256 positionId) external view returns (struct TradingPairData)
```

