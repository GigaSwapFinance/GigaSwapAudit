# Solidity API

## Withdrawable

Submitted for verification at Etherscan.io on 2022-08-16

### _withdrawAddress

```solidity
address _withdrawAddress
```

### constructor

```solidity
constructor(address withdrawAddress__) internal
```

### onlyWithdrawer

```solidity
modifier onlyWithdrawer()
```

### withdraw

```solidity
function withdraw() external
```

### _withdraw

```solidity
function _withdraw() internal
```

### setWithdrawAddress

```solidity
function setWithdrawAddress(address newWithdrawAddress) external
```

### withdrawAddress

```solidity
function withdrawAddress() external view returns (address)
```

## Ownable

### _owner

```solidity
address _owner
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### constructor

```solidity
constructor() internal
```

### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

### owner

```solidity
function owner() external view returns (address)
```

## IUniswapV2Factory

### createPair

```solidity
function createPair(address tokenA, address tokenB) external returns (address pair)
```

### getPair

```solidity
function getPair(address tokenA, address tokenB) external view returns (address pair)
```

## IUniswapV2Router02

### swapExactTokensForETH

```solidity
function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external
```

### swapExactTokensForETHSupportingFeeOnTransferTokens

```solidity
function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external
```

### swapETHForExactTokens

```solidity
function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) external payable returns (uint256[] amounts)
```

### factory

```solidity
function factory() external pure returns (address)
```

### WETH

```solidity
function WETH() external pure returns (address)
```

### addLiquidityETH

```solidity
function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)
```

## DoubleSwapped

### _inSwap

```solidity
bool _inSwap
```

### lockTheSwap

```solidity
modifier lockTheSwap()
```

### _swapTokensForEth

```solidity
function _swapTokensForEth(uint256 tokenAmount, contract IUniswapV2Router02 _uniswapV2Router) internal
```

### _swapTokensForEthOnTransfer

```solidity
function _swapTokensForEthOnTransfer(uint256 transferAmount, uint256 swapCount, contract IUniswapV2Router02 _uniswapV2Router) internal
```

## IERC20

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### transfer

```solidity
function transfer(address recipient, uint256 amount) external returns (bool)
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

### transferFrom

```solidity
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)
```

### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

## ERC20

### _totalSupply

```solidity
uint256 _totalSupply
```

### _decimals

```solidity
uint8 _decimals
```

### _name

```solidity
string _name
```

### _symbol

```solidity
string _symbol
```

### _balances

```solidity
mapping(address => uint256) _balances
```

### _allowances

```solidity
mapping(address => mapping(address => uint256)) _allowances
```

### INFINITY_ALLOWANCE

```solidity
uint256 INFINITY_ALLOWANCE
```

### constructor

```solidity
constructor(string name_, string symbol_) internal
```

### name

```solidity
function name() external view returns (string)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### decimals

```solidity
function decimals() external pure returns (uint8)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view virtual returns (uint256)
```

### transfer

```solidity
function transfer(address recipient, uint256 amount) external returns (bool)
```

### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal virtual
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

### _approve

```solidity
function _approve(address owner, address spender, uint256 amount) internal virtual
```

### transferFrom

```solidity
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)
```

### _burn

```solidity
function _burn(address account, uint256 amount) internal virtual
```

## MaxWalletDynamic

### startMaxWallet

```solidity
uint256 startMaxWallet
```

### startTime

```solidity
uint256 startTime
```

### startMaxBuyPercentil

```solidity
uint256 startMaxBuyPercentil
```

### maxBuyIncrementMinutesTimer

```solidity
uint256 maxBuyIncrementMinutesTimer
```

### maxBuyIncrementPercentil

```solidity
uint256 maxBuyIncrementPercentil
```

### maxIncrements

```solidity
uint256 maxIncrements
```

### maxBuyIncrementValue

```solidity
uint256 maxBuyIncrementValue
```

### startMaxWalletDynamic

```solidity
function startMaxWalletDynamic(uint256 totalSupply) internal
```

### checkMaxWallet

```solidity
function checkMaxWallet(uint256 walletSize) internal view
```

### getMaxWallet

```solidity
function getMaxWallet() public view returns (uint256)
```

### _setStartMaxWallet

```solidity
function _setStartMaxWallet(uint256 startMaxWallet_) internal
```

## TradableErc20

### _uniswapV2Router

```solidity
contract IUniswapV2Router02 _uniswapV2Router
```

### uniswapPair

```solidity
address uniswapPair
```

### buyEnable

```solidity
bool buyEnable
```

### ADDR_BURN

```solidity
address ADDR_BURN
```

### extraAddress

```solidity
address extraAddress
```

### _isExcludedFromFee

```solidity
mapping(address => bool) _isExcludedFromFee
```

### buyFeePpm

```solidity
uint256 buyFeePpm
```

### sellFeePpm

```solidity
uint256 sellFeePpm
```

### thisShare

```solidity
uint256 thisShare
```

### extraShare

```solidity
uint256 extraShare
```

### maxWalletStart

```solidity
uint256 maxWalletStart
```

### addMaxWalletPerMinute

```solidity
uint256 addMaxWalletPerMinute
```

### tradingStartTime

```solidity
uint256 tradingStartTime
```

### constructor

```solidity
constructor(string name_, string symbol_) internal
```

### receive

```solidity
receive() external payable
```

### maxWallet

```solidity
function maxWallet() public view returns (uint256)
```

### createLiquidity

```solidity
function createLiquidity() public
```

### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal
```

### getFeeBuy

```solidity
function getFeeBuy(address, uint256 amount) public view returns (uint256)
```

### getFeeSell

```solidity
function getFeeSell(address, uint256 amount) public view returns (uint256)
```

### setBuyFee

```solidity
function setBuyFee(uint256 newBuyFeePpm) external
```

### setSellFee

```solidity
function setSellFee(uint256 newSellFeePpm) external
```

### SetExtraContractAddress

```solidity
function SetExtraContractAddress(address newExtraContractAddress) external
```

### removeExtraContractAddress

```solidity
function removeExtraContractAddress() external
```

### setShare

```solidity
function setShare(uint256 thisSharePpm, uint256 stackingSharePpm) external
```

### setExcludeFromFee

```solidity
function setExcludeFromFee(address[] accounts, bool value) external
```

### setEnableBuy

```solidity
function setEnableBuy(bool value) external
```

### getSupplyForMakeLiquidity

```solidity
function getSupplyForMakeLiquidity() internal virtual returns (uint256)
```

## AirdropData

```solidity
struct AirdropData {
  address acc;
  uint256 count;
}
```

## GigaSwapErc20

### constructor

```solidity
constructor() public
```

### getSupplyForMakeLiquidity

```solidity
function getSupplyForMakeLiquidity() internal view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

