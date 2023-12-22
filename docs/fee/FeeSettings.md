# Solidity API

## FeeSettings

### _feeAddress

```solidity
address _feeAddress
```

### _feePercent

```solidity
uint256 _feePercent
```

### _maxFeePercent

```solidity
uint256 _maxFeePercent
```

### _feeEth

```solidity
uint256 _feeEth
```

### _maxFeeEth

```solidity
uint256 _maxFeeEth
```

### gigaToken

```solidity
contract IERC20 gigaToken
```

### constructor

```solidity
constructor(address gigaTokenAddress) public
```

### zeroFeeShare

```solidity
function zeroFeeShare() external view returns (uint256)
```

if account balance is greather than or equal this value, than this account has no fee

### feeAddress

```solidity
function feeAddress() external view returns (address)
```

address to pay fee

### feePercent

```solidity
function feePercent() external view returns (uint256)
```

fee in 1/decimals for dividing values

### feePercentFor

```solidity
function feePercentFor(address account) external view returns (uint256)
```

account fee share

_used only if asset is dividing
fee in 1/feeDecimals for dividing values_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | the account, that can be hold GigaSwap token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 asset fee share in 1/feeDecimals |

### feeForCount

```solidity
function feeForCount(address account, uint256 count) external view returns (uint256)
```

account fee for certain asset count

_used only if asset is dividing_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | the account, that can be hold GigaSwap token |
| count | uint256 | asset count for calculate fee |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 asset fee count |

### feeDecimals

```solidity
function feeDecimals() external pure returns (uint256)
```

decimals for fee shares

### feeEth

```solidity
function feeEth() external view returns (uint256)
```

fix fee value

_used only if asset is not dividing_

### feeEthFor

```solidity
function feeEthFor(address account) external view returns (uint256)
```

fee in 1/decimals for dividing values

### setFeeAddress

```solidity
function setFeeAddress(address newFeeAddress) public
```

### setFeePercent

```solidity
function setFeePercent(uint256 newFeePercent) external
```

### setFeeEth

```solidity
function setFeeEth(uint256 newFeeEth) external
```

