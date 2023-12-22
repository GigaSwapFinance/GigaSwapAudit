# Solidity API

## DealsController

### _deals

```solidity
mapping(uint256 => struct Deal) _deals
```

### _dealPoints

```solidity
mapping(uint256 => mapping(uint256 => struct DealPointRef)) _dealPoints
```

### _dealsCount

```solidity
uint256 _dealsCount
```

### _totalDealPointsCount

```solidity
uint256 _totalDealPointsCount
```

### dealPointsLimit

```solidity
uint256 dealPointsLimit
```

### _swapTimes

```solidity
mapping(uint256 => uint256) _swapTimes
```

### onlyEditDealState

```solidity
modifier onlyEditDealState(uint256 dealId)
```

### onlyExecutionDealState

```solidity
modifier onlyExecutionDealState(uint256 dealId)
```

### getTotalDealPointsCount

```solidity
function getTotalDealPointsCount() external view returns (uint256)
```

_total deal points count_

### createDeal

```solidity
function createDeal(address owner1, address owner2) external returns (uint256)
```

_creates the deal.
Only for factories._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner1 | address | - first owner (creator) |
| owner2 | address | - second owner of deal. If zero than deal is open for any account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | id of new deal |

### addDealPoint

```solidity
function addDealPoint(uint256 dealId, address dealPointsController, uint256 newPointId) external
```

_adds the deal point to deal.
only for factories_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| dealId | uint256 | deal id |
| dealPointsController | address |  |
| newPointId | uint256 |  |

### getDealHeader

```solidity
function getDealHeader(uint256 dealId) external view returns (struct Deal)
```

_returns the deals header information (without points)_

### getDeal

```solidity
function getDeal(uint256 dealId) external view returns (struct Deal, struct DealPointData[])
```

_returns a deal, if there is no such deal, it gives an error_

### isExecuted

```solidity
function isExecuted(uint256 dealId) external view returns (bool)
```

_if true, then the transaction is completed and it can be swapped_

### swap

```solidity
function swap(uint256 dealId) external
```

_swap the deal_

### isSwapped

```solidity
function isSwapped(uint256 dealId) external view returns (bool)
```

_if true, than deal is swapped_

### swapTime

```solidity
function swapTime(uint256 dealId) external view returns (uint256)
```

_when position is swapped or 0_

### withdraw

```solidity
function withdraw(uint256 dealId) external payable
```

_makes withdraw from all deal points of deal, where caller is owner_

### feeEthOnWithdraw

```solidity
function feeEthOnWithdraw(uint256 dealId, uint256 ownerNumber) external view returns (uint256)
```

_returns fee in ether on withdraw for owner number_

### getDealPoint

```solidity
function getDealPoint(uint256 dealId, uint256 pointIndex) external view returns (struct DealPointData)
```

_returns deal point by its index in deal_

### getDealPointsCount

```solidity
function getDealPointsCount(uint256 dealId) external view returns (uint256)
```

_returns deal points count for the deal_

### getDealPoints

```solidity
function getDealPoints(uint256 dealId) external view returns (struct DealPointRef[])
```

_returns all deal points_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| dealId | uint256 | deal id |

### stopDealEditing

```solidity
function stopDealEditing(uint256 dealId) external
```

_stops all editing for deal
only for factories_

### execute

```solidity
function execute(uint256 dealId) external payable
```

_executes all points of the deal_

### executeEtherValue

```solidity
function executeEtherValue(uint256 dealId, uint256 ownerNumber) external view returns (uint256)
```

_the execute ether value for owner with number_

