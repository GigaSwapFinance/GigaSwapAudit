# Solidity API

## FeeSettingsWriter

_owner of the FeeSettings contract and this contract performs changes to the voting results_

### feeSettings

```solidity
contract IFeeSettingsSetters feeSettings
```

### constructor

```solidity
constructor(address feeSettingsAddress) public
```

### setFeeAddress

```solidity
function setFeeAddress(address newFeeAddress) external
```

sets address for pay fee

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newFeeAddress | address | new fee address |

### setFeePercent

```solidity
function setFeePercent(uint256 newFeePercent) external
```

sets new fee percent

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newFeePercent | uint256 | new fee percent |

### setFeeEth

```solidity
function setFeeEth(uint256 newFeeEth) external
```

sets new ethereum fee for indivisible assets

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newFeeEth | uint256 | new ethereum fee for indivisible assets |

