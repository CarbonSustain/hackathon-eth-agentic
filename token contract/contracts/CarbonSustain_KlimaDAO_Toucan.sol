// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonSustain is Ownable {
    IERC20 public klimaDAOToken;
    IERC20 public toucanToken;
    address public profitWallet;

    struct CarbonCredit {
        uint256 companyId;
        address wallet;
        uint256 amount;
    }

    mapping(address => CarbonCredit) public carbonCredits;

    event CarbonCreditCreated(address indexed user, uint256 companyId, uint256 amount);
    event ProfitShared(address indexed recipient, uint256 amount);

    constructor(address _klimaDAO, address _toucan, address _profitWallet) Ownable(msg.sender) {
        klimaDAOToken = IERC20(_klimaDAO);
        toucanToken = IERC20(_toucan);
        profitWallet = _profitWallet;
    }

    function createCarbonCredit(uint256 _companyId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than zero");
        
        uint256 halfAmount = _amount / 2; 

        require(klimaDAOToken.transferFrom(msg.sender, address(this), halfAmount), "KlimaDAO transfer failed");
        require(toucanToken.transferFrom(msg.sender, address(this), halfAmount), "Toucan transfer failed");

        carbonCredits[msg.sender] = CarbonCredit(_companyId, msg.sender, _amount);

        emit CarbonCreditCreated(msg.sender, _companyId, _amount);
    }

    function distributeProfits(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than zero");
        require(klimaDAOToken.transfer(profitWallet, _amount / 2), "KlimaDAO profit transfer failed");
        require(toucanToken.transfer(profitWallet, _amount / 2), "Toucan profit transfer failed");

        emit ProfitShared(profitWallet, _amount);
    }
}
