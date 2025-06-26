// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Lottery
 * @notice Simple lottery interacting with the BEP-20 USDT token on BNB Chain.
 * Players buy tickets priced in USDT and winners are paid in the same token.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Lottery {
    IERC20 public immutable usdt; // BEP-20 USDT token
    address public immutable admin;

    uint256 public constant TICKET_PRICE = 10 * 1e18; // 10 USDT per ticket (18 decimals)
    uint256 public constant MAX_TICKETS = 100;       // cap per round
    uint256 public pendingAdminFees;                 // fees awaiting withdrawal
    uint256 public currentRound;                     // id of the latest round

    // Mapping of round => list of players (each entry represents one ticket)
    mapping(uint256 => address[]) public roundPlayers;
    // Active state per round
    mapping(uint256 => bool) public roundActive;
    // Whether winners for a round have been picked
    mapping(uint256 => bool) public winnersPicked;

    event RoundStarted(uint256 round);
    event TicketPurchased(uint256 round, address indexed player, uint256 ticketNumber);
    event RoundEnded(uint256 round);
    event Winners(uint256 round, address first, address second, address third);
    event AdminFeesWithdrawn(address indexed to, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _usdt) {
        usdt = IERC20(_usdt);
        admin = msg.sender;
    }

    /**
     * @notice Start a new lottery round.
     * The admin must call this to begin ticket sales.
     */
    function startRound() external onlyAdmin {
        require(!roundActive[currentRound], "Current round still active");
        currentRound += 1;
        roundActive[currentRound] = true;
        emit RoundStarted(currentRound);
    }

    /**
     * @notice Purchase a single ticket for the current round.
     * Caller must approve this contract to spend 10 USDT beforehand.
     */
    function buyTicket() external {
        require(roundActive[currentRound], "No active round");
        require(roundPlayers[currentRound].length < MAX_TICKETS, "All tickets sold");

        // Transfer ticket price from buyer to this contract
        require(usdt.transferFrom(msg.sender, address(this), TICKET_PRICE), "USDT transfer failed");

        roundPlayers[currentRound].push(msg.sender);
        emit TicketPurchased(currentRound, msg.sender, roundPlayers[currentRound].length);

        // Auto-end round when maximum tickets have been sold
        if (roundPlayers[currentRound].length == MAX_TICKETS) {
            roundActive[currentRound] = false;
            emit RoundEnded(currentRound);
        }
    }

    /**
     * @notice End the round manually. Only admin can call.
     */
    function endRound() external onlyAdmin {
        require(roundActive[currentRound], "Round not active");
        roundActive[currentRound] = false;
        emit RoundEnded(currentRound);
    }

    /**
     * @notice Pick three winners and distribute prizes.
     * Collects a 10% fee for the admin and rewards 400, 300 and 200 USDT
     * to the first, second and third place respectively. Pseudo random numbers
     * derived from block data are used here and are **not** suitable for high-value lotteries.
     */
    function pickWinners() external onlyAdmin {
        require(!roundActive[currentRound], "Round still active");
        require(!winnersPicked[currentRound], "Winners already picked");
        address[] storage players = roundPlayers[currentRound];
        require(players.length == MAX_TICKETS, "Round not complete");

        uint256 totalPool = players.length * TICKET_PRICE;
        uint256 fee = (totalPool * 10) / 100; // admin fee
        pendingAdminFees += fee;

        uint256[3] memory prizes = [uint256(400 * 1e18), 300 * 1e18, 200 * 1e18];

        address first = players[_random(players.length, 0)];
        address second = players[_random(players.length, 1)];
        address third = players[_random(players.length, 2)];

        winnersPicked[currentRound] = true;

        require(usdt.transfer(first, prizes[0]), "Prize 1 transfer failed");
        require(usdt.transfer(second, prizes[1]), "Prize 2 transfer failed");
        require(usdt.transfer(third, prizes[2]), "Prize 3 transfer failed");

        emit Winners(currentRound, first, second, third);
    }

    /**
     * @notice Withdraw accumulated admin fees.
     */
    function withdrawAdminFees(address to) external onlyAdmin {
        uint256 amount = pendingAdminFees;
        pendingAdminFees = 0;
        require(usdt.transfer(to, amount), "Fee withdrawal failed");
        emit AdminFeesWithdrawn(to, amount);
    }

    // Internal helper to produce a pseudo random number
    function _random(uint256 max, uint256 nonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce))) % max;
    }
}

