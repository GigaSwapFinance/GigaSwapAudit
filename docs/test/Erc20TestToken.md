# Solidity API

## Erc20TestToken

### _decimals

```solidity
uint8 _decimals
```

### constructor

```solidity
constructor(uint8 decimals_) public
```

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the default value returned by this function, unless
it's overridden.

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

### mintTest

```solidity
function mintTest(uint256 count) public
```

### mint

```solidity
function mint(uint256 count) public
```

### mintTo

```solidity
function mintTo(address account, uint256 count) public
```

