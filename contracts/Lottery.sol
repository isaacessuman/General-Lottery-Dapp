// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Lottery
 * @dev Simple lottery contract allowing players to enter with Ether
 * and an owner to pick a random winner.
 */
contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    /**
     * @dev enter the lottery by sending at least 0.01 ether
     */
    function enter() external payable {
        require(msg.value >= 0.01 ether, "Minimum entry is 0.01 ETH");
        players.push(msg.sender);
    }

    /**
     * @dev return array of current players
     */
    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    /**
     * @dev pick a pseudorandom winner and transfer the balance
     */
    function pickWinner() external restricted {
        require(players.length > 0, "No players entered");
        uint256 index = random() % players.length;
        address winner = players[index];
        players = new address[](0);
        payable(winner).transfer(address(this).balance);
    }

    function random() private view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(block.difficulty, block.timestamp, players)
            )
        );
    }

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call");
        _;
    }
}
