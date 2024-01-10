# Solidity API

## GigaSwapTokenSetWithdrawAddressVote

### data

```solidity
mapping(uint256 => address) data
```

### constructor

```solidity
constructor(address voteAddress, address writerAddress) public
```

### startVote

```solidity
function startVote(address newValue) external payable
```

starts the vote

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newValue | address | new WithdrawAddress |

### _execute

```solidity
function _execute(uint256 voteId) internal
```

