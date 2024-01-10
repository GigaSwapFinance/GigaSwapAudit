# Solidity API

## GigaSwapTokenWriter

_when is owner of contract - it can change contract properties that onlyOwner_

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

sets buy fee

### setSellFee

```solidity
function setSellFee(uint256 newSellFeePpm) external
```

sets sell fee

### SetExtraContractAddress

```solidity
function SetExtraContractAddress(address newExtraContractAddress) external
```

sets Extra Contract Address

### removeExtraContractAddress

```solidity
function removeExtraContractAddress() external
```

removes Extra Contract Address

### setShare

```solidity
function setShare(uint256 thisSharePpm, uint256 stackingSharePpm) external
```

sets shares

### setWithdrawAddress

```solidity
function setWithdrawAddress(address newWithdrawAddress) external
```

sets withdraw fee address

