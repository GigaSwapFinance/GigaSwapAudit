# Solidity API

## GigaSwapTokenSetExtraContractAddressVote

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

_newValue new ExtraContractAddress_

### _execute

```solidity
function _execute(uint256 voteId) internal
```

