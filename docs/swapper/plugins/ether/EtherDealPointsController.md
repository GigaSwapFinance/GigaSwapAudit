# Solidity API

## EtherDealPointsController

### constructor

```solidity
constructor(address dealsController_) public
```

### dealPointTypeId

```solidity
function dealPointTypeId() external pure returns (uint256)
```

returns type id of deal points

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | 1 - eth; 2 - erc20; 3 - erc721 item; 4 - erc721 count; |

### createPoint

```solidity
function createPoint(uint256 dealId_, address from_, address to_, uint256 count_, uint256 withdrawTimer_) external
```

_creates the deal point
only for factories_

### _execute

```solidity
function _execute(uint256 pointId, address) internal virtual
```

### _withdraw

```solidity
function _withdraw(uint256 pointId, address withdrawAddr, uint256 withdrawCount) internal virtual
```

### feeIsEthOnWithdraw

```solidity
function feeIsEthOnWithdraw() external pure returns (bool)
```

if true, than fee is ether, that sends on withdraw after swapped

### executeEtherValue

```solidity
function executeEtherValue(uint256 pointId) external view returns (uint256)
```

the execute ether value for owner with number

