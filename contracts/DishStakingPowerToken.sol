pragma solidity =0.6.6;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract DishStakingPowerToken is ERC20Pausable, AccessControl, Ownable {
    bytes32 public constant PAUSED_ROLE = keccak256('PAUSED_ROLE');

    constructor() public ERC20('Dish Staking Power Token', 'DSPT') {
        _setupRole(PAUSED_ROLE, _msgSender());
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public {
        uint256 decreasedAllowance = allowance(account, _msgSender()).sub(
            amount,
            'ERC20: burn amount exceeds allowance'
        );

        _approve(account, _msgSender(), decreasedAllowance);
        _burn(account, amount);
    }

    function pause() public whenNotPaused {
        require(hasRole(PAUSED_ROLE, _msgSender()), 'Must have pause role');
        _pause();
    }

    function unpause() public whenPaused {
        require(hasRole(PAUSED_ROLE, _msgSender()), 'Must have pause role');
        _unpause();
    }
}
