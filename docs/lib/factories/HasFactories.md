# Solidity API

## HasFactories

### _factories

```solidity
mapping(address => bool) _factories
```

### onlyFactory

```solidity
modifier onlyFactory()
```

### isFactory

```solidity
function isFactory(address addr) external view returns (bool)
```

_returns true, if address is factory_

### _isFactory

```solidity
function _isFactory(address addr) internal view returns (bool)
```

### addFactory

```solidity
function addFactory(address factory) external
```

_mark address as factory (only owner)_

### removeFactory

```solidity
function removeFactory(address factory) external
```

_mark address as not factory (only owner)_

### setFactories

```solidity
function setFactories(address[] addresses, bool isFactory_) external
```

_mark addresses as factory or not (only owner)_

