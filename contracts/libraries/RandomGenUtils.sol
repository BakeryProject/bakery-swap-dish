pragma solidity >=0.5.0;

library RandomGenUtils {
    function randomGen(uint256 seed, uint256 max) internal view returns (uint256 randomNumber) {
        return (uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), now, msg.sender, block.difficulty, seed))
        ) % max);
    }
}
