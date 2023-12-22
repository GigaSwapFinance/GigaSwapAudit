# Solidity API

## EtherPointCreationData

```solidity
struct EtherPointCreationData {
  address from;
  address to;
  uint256 count;
  uint256 withdrawTimer;
}
```

## Erc20PointCreationData

```solidity
struct Erc20PointCreationData {
  address from;
  address to;
  address token;
  uint256 count;
  uint256 withdrawTimer;
}
```

## Erc721ItemPointCreationData

```solidity
struct Erc721ItemPointCreationData {
  address from;
  address to;
  address token;
  uint256 tokenId;
  uint256 withdrawTimer;
}
```

## Erc721CountPointCreationData

```solidity
struct Erc721CountPointCreationData {
  address from;
  address to;
  address token;
  uint256 count;
  uint256 withdrawTimer;
}
```

## DealCreationData

```solidity
struct DealCreationData {
  address owner2;
  struct EtherPointCreationData[] eth;
  struct Erc20PointCreationData[] erc20;
  struct Erc721ItemPointCreationData[] erc721Item;
  struct Erc721CountPointCreationData[] erc721Count;
}
```

## DealsFactory

### dealsController

```solidity
contract IDealsController dealsController
```

### eth

```solidity
contract IEtherDealPointsController eth
```

### erc20

```solidity
contract IErc20DealPointsController erc20
```

### erc721Item

```solidity
contract IErc721ItemDealPointsController erc721Item
```

### erc721Count

```solidity
contract IErc721CountDealPointsController erc721Count
```

### constructor

```solidity
constructor(contract IDealsController dealsController_, contract IEtherDealPointsController eth_, contract IErc20DealPointsController erc20_, contract IErc721ItemDealPointsController erc721Item_, contract IErc721CountDealPointsController erc721Count_) public
```

### createDeal

```solidity
function createDeal(struct DealCreationData data) external
```

