# Solidity API

## IDealPointsController

controller for swap deals

### receive

```solidity
receive() external payable
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

### dealId

```solidity
function dealId(uint256 pointId) external view returns (uint256)
```

returns deal id for deal point or 0 if point is not exists in this controller

### tokenAddress

```solidity
function tokenAddress(uint256 pointId) external view returns (address)
```

token contract address, that need to be transferred or zero

### from

```solidity
function from(uint256 pointId) external view returns (address)
```

from

_zero address - for open swap_

### to

```solidity
function to(uint256 pointId) external view returns (address)
```

to

### withdrawTimer

```solidity
function withdrawTimer(uint256 pointId) external view returns (uint256)
```

withdrawTimer

### withdrawTime

```solidity
function withdrawTime(uint256 positionId) external view returns (uint256)
```

returns allowed times to withdraw assets after executing

### setTo

```solidity
function setTo(uint256 pointId, address account) external
```

sets to account for point

_only DealsController and only once_

### value

```solidity
function value(uint256 pointId) external view returns (uint256)
```

asset value (count or nft id), needs to execute deal point

### balance

```solidity
function balance(uint256 pointId) external view returns (uint256)
```

balance of the deal point

### fee

```solidity
function fee(uint256 pointId) external view returns (uint256)
```

deal point fee. In ether or token. Only if withdraw after deal is swapped

### feeIsEthOnWithdraw

```solidity
function feeIsEthOnWithdraw() external pure returns (bool)
```

if true, than fee is ether, that sends on withdraw after swapped

### owner

```solidity
function owner(uint256 pointId) external view returns (address)
```

current owner of deal point

_zero address - for open deals, before execution_

### dealsController

```solidity
function dealsController() external view returns (address)
```

deals controller

### isSwapped

```solidity
function isSwapped(uint256 pointId) external view returns (bool)
```

if true, than deal is swapped

### isExecuted

```solidity
function isExecuted(uint256 pointId) external view returns (bool)
```

if true, than point is executed and can be swapped

### execute

```solidity
function execute(uint256 pointId, address addr) external payable
```

executes the point, by using address

_if already executed than nothing happens_

### executeEtherValue

```solidity
function executeEtherValue(uint256 pointId) external view returns (uint256)
```

the execute ether value for owner with number

### withdraw

```solidity
function withdraw(uint256 pointId) external payable
```

withdraw the asset from deal point

_only deals controller_

