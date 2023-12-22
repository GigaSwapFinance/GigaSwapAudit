# Solidity API

## IErc721ItemDealPointsController

### createPoint

```solidity
function createPoint(uint256 dealId_, address from_, address to_, address token_, uint256 tokenId_, uint256 withdrawTimer_) external
```

_creates the deal point_

### tokenId

```solidity
function tokenId(uint256 pointId) external view returns (uint256)
```

_token id that need to transfer_

