# Solidity API

## IErc721CountDealPointsController

### createPoint

```solidity
function createPoint(uint256 dealId_, address from_, address to_, address token_, uint256 count_, uint256 withdrawTimer_) external
```

_creates the deal point_

### tokensId

```solidity
function tokensId(uint256 pointId) external view returns (uint256[])
```

_all tokens, that stores deal point_

