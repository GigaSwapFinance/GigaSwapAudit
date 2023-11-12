// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.17;

import './IPacketErc20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract PacketErc20 is IPacketErc20 {
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => uint256)) _balances;
    mapping(address => mapping(address => Stack[])) _stacks;

    function addStack(
        address account,
        address tokenAddress,
        uint256 count,
        uint256 claimTimer
    ) external {
        IERC20 token = IERC20(tokenAddress);
        uint256 lastBalance = token.balanceOf(address(this));
        token.transferFrom(msg.sender, address(this), count);
        uint256 transferred = token.balanceOf(address(this)) - lastBalance;
        uint256 claimTime = block.timestamp + claimTimer;
        _stacks[tokenAddress][account].push(Stack(claimTime, transferred));
        emit OnAddStack(account, tokenAddress, transferred, claimTime);
    }

    function balance(
        address account,
        address tokenAddress
    ) external view returns (uint256) {
        //return _balances[tokenAddress][account];
        uint256 res;
        Stack[] storage data = _stacks[tokenAddress][account];
        for (uint256 i = 0; i < data.length; ++i) {
            Stack storage s = data[i];
            res += s.count;
        }
        return res;
    }

    function claimCount(
        address account,
        address tokenAddress
    ) external view returns (uint256) {
        uint256 res;
        Stack[] storage data = _stacks[tokenAddress][account];
        for (uint256 i = 0; i < data.length; ++i) {
            Stack storage s = data[i];
            if (block.timestamp < s.claimTime) continue;
            res += s.count;
        }
        return res;
    }

    function stacks(
        address account,
        address tokenAddress
    ) external view returns (Stack[] memory) {
        return _stacks[tokenAddress][account];
    }

    function claim(address tokenAddress) external {
        _claim(msg.sender, tokenAddress);
    }

    function _claim(address account, address tokenAddress) private {
        uint256 count;
        Stack[] memory data = _stacks[tokenAddress][account];
        delete _stacks[tokenAddress][account];
        for (uint256 i = 0; i < data.length; ++i) {
            Stack memory s = data[i];
            if (block.timestamp < s.claimTime) {
                _stacks[tokenAddress][account].push(s);
                continue;
            }
            count += s.count;
        }
        require(count > 0, 'nothing to claim');
        IERC20 token = IERC20(tokenAddress);
        uint256 lastBalance = token.balanceOf(address(this));
        token.safeTransfer(account, count);
        uint256 transferred = lastBalance - token.balanceOf(address(this));
        emit OnClaim(account, tokenAddress, transferred);
    }
}
