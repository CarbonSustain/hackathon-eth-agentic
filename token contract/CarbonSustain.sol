// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonSustain is ERC20, Ownable {
    event CarbonCreditCreated(address indexed user, uint256 companyId, uint256 amount);
    event ProfitShared(address indexed recipient, uint256 amount);

    constructor() ERC20("CarbonSustain", "CSN") Ownable(msg.sender) {}

    function createCarbonCredit(uint256 _companyId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");

        _mint(msg.sender, _amount); // Mint CarbonSustain tokens
        emit CarbonCreditCreated(msg.sender, _companyId, _amount);
    }

    function distributeProfits(address _recipient, uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than zero");
        require(balanceOf(address(this)) >= _amount, "Insufficient contract balance");

        _transfer(address(this), _recipient, _amount);
        emit ProfitShared(_recipient, _amount);
    }
}
