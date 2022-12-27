// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenBase is ERC20 {
    address public admin;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "not authorized");
        _;
    }
    function updateAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    function mint(address _to, uint _amount) external onlyAdmin{
       _mint(_to, _amount);
    }

    function burn(address _from, uint _amount) external onlyAdmin {
        _burn(_from, _amount);
    }
}
