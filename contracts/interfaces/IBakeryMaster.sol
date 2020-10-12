pragma solidity >=0.6.2;

interface IBakeryMaster {
    function poolUserInfoMap(address, address) external view returns (uint256, uint256);

    function pendingBake(address _pair, address _user) external view returns (uint256);

    function deposit(address _pair, uint256 _amount) external;

    function withdraw(address _pair, uint256 _amount) external;

    function emergencyWithdraw(address _pair) external;
}
