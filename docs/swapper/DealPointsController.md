# Solidity API

## DealPointsController

### _dealsController

```solidity
contract IDealsController _dealsController
```

### _data

```solidity
mapping(uint256 => struct DealPointDataInternal) _data
```

### _balances

```solidity
mapping(uint256 => uint256) _balances
```

### _fee

```solidity
mapping(uint256 => uint256) _fee
```

### _isExecuted

```solidity
mapping(uint256 => bool) _isExecuted
```

### _tokenAddress

```solidity
mapping(uint256 => address) _tokenAddress
```

### constructor

```solidity
constructor(address dealsController_) internal
```

### receive

```solidity
receive() external payable
```

### onlyDealsController

```solidity
modifier onlyDealsController()
```

### onlyFactory

```solidity
modifier onlyFactory()
```

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

### dealId

```solidity
function dealId(uint256 pointId) external view returns (uint256)
```

returns deal id for deal point or 0 if point is not exists in this controller

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
function withdrawTime(uint256 pointId) external view returns (uint256)
```

### setTo

```solidity
function setTo(uint256 pointId, address account) external
```

sets to account for point

_only DealsController and only once_

### tokenAddress

```solidity
function tokenAddress(uint256 pointId) external view returns (address)
```

token contract address, that need to be transferred or zero

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

### withdraw

```solidity
function withdraw(uint256 pointId) external payable
```

withdraw the asset from deal point

_only deals controller_

### execute

```solidity
function execute(uint256 pointId, address addr) external payable
```

executes the point, by using address

_if already executed than nothing happens_

### _execute

```solidity
function _execute(uint256 pointId, address from) internal virtual
```

### _withdraw

```solidity
function _withdraw(uint256 pointId, address withdrawAddr, uint256 withdrawCount) internal virtual
```

