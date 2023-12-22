# Solidity API

## Erc20SaleWeth

_wrapper_

### _sale

```solidity
contract Erc20Sale _sale
```

### _weth

```solidity
contract IgWETH _weth
```

### constructor

```solidity
constructor(address saleAlg, address weth) public
```

### getSaleAlg

```solidity
function getSaleAlg() external view returns (address)
```

### buy

```solidity
function buy(uint256 positionId, address to, uint256 count, uint256 priceNom, uint256 priceDenom, address antibot) external payable
```

