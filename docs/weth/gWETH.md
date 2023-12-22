# Solidity API

## gWETH

### _withoutAllowance

```solidity
mapping(address => bool) _withoutAllowance
```

### _owner

```solidity
address _owner
```

### constructor

```solidity
constructor() public
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### receive

```solidity
receive() external payable
```

### ownerAddress

```solidity
function ownerAddress() external view virtual returns (address)
```

### setWithoutAllowance

```solidity
function setWithoutAllowance(address[] addrs, bool isWithoutAllowance) external
```

### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

### allowance

```solidity
function allowance(address owner, address spender) public view virtual returns (uint256)
```

_See {IERC20-allowance}._

### mint

```solidity
function mint() external payable
```

### mintTo

```solidity
function mintTo(address account) external payable
```

### unwrap

```solidity
function unwrap(uint256 amount) external
```

### _spendAllowance

```solidity
function _spendAllowance(address owner, address spender, uint256 amount) internal virtual
```

_Updates `owner` s allowance for `spender` based on spent `amount`.

Does not update the allowance amount in case of infinite allowance.
Revert if not enough allowance is available.

Might emit an {Approval} event._

### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual
```

