# Solidity API

## GigaSwapTokenWriter

### token

```solidity
contract IGigaSwapTokenSetters token
```

### constructor

```solidity
constructor(address tokenAddress) public
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

### setWithdrawAddress

```solidity
function setWithdrawAddress(address newWithdrawAddress) external
```

