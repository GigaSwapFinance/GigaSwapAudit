# Solidity API

## IDealsController

### NewDeal

```solidity
event NewDeal(uint256 dealId, address creator)
```

_new deal created
deals are creates by factories by one transaction, therefore another events, such as deal point adding is no need_

### Swap

```solidity
event Swap(uint256 dealId)
```

_the deal is swapped_

### Execute

```solidity
event Execute(uint256 dealId, address account, bool executed)
```

_the deal is executed by account_

### OnWithdraw

```solidity
event OnWithdraw(uint256 dealId, address account)
```

_the deal withdraw_

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

### getDeal

```solidity
function getDeal(uint256 dealId) external view returns (struct Deal, struct DealPointData[])
```

_returns all deal information_

### getDealHeader

```solidity
function getDealHeader(uint256 dealId) external view returns (struct Deal)
```

_returns the deals header information (without points)_

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

### isExecuted

```solidity
function isExecuted(uint256 dealId) external view returns (bool)
```

_returns true, if all deal points is executed, and can be made swap, if not swapped already_

### withdraw

```solidity
function withdraw(uint256 dealId) external payable
```

_makes withdraw from all deal points of deal, where caller is owner_

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

### feeEthOnWithdraw

```solidity
function feeEthOnWithdraw(uint256 dealId, uint256 ownerNumber) external view returns (uint256)
```

_returns fee in ether on withdraw for owner number_

