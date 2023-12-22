# Solidity API

## Erc20DealPointsController

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
function createPoint(uint256 dealId_, address from_, address to_, address token_, uint256 count_, uint256 withdrawTimer_) external
```

### _execute

```solidity
function _execute(uint256 pointId, address from) internal virtual
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
function executeEtherValue(uint256) external pure returns (uint256)
```

