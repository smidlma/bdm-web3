// SPDX-License-Identifier: MIT
pragma solidity >=0.8.25;

contract LuckyBox {
    struct Player {
        address adr;
        uint256 funds;
        string name;
        bool isWinner;
    }

    struct Game {
        Player[] players;
        uint256 totalFunds;
        uint256 boxId;
        uint256 endTime;
        bool isActive;
    }
    enum State {
        IDLE,
        IN_PROGRESS
    }

    uint256 private boxId;
    mapping(uint256 => Game) private games;
    State private state;

    event GameChanged(uint256 indexed id, Game info);

    error InvalidState();

    modifier inState(State state_) {
        if (state != state_) revert InvalidState();
        _;
    }

    // Some time lock in future
    constructor() {
        boxId = 1;
        state = State.IDLE;
    }

    // Add funds method maybe with player name
    function addFunds(string memory _playerName) external payable {
        require(
            games[boxId].players.length < 3,
            "Maximum number of players reached."
        );
        if (state == State.IDLE) {
            state = State.IN_PROGRESS;
            games[boxId].endTime = block.timestamp + 1 minutes;
            games[boxId].isActive = true;
        }
        require(block.timestamp < games[boxId].endTime, "The game has ended");
        bool isPlayerInGame = false;
        for (uint256 i = 0; i < games[boxId].players.length; i++) {
            if (games[boxId].players[i].adr == msg.sender) {
                games[boxId].players[i].funds += msg.value;
                isPlayerInGame = true;
                break;
            }
        }
        if (!isPlayerInGame) {
            Player memory p = Player(msg.sender, msg.value, _playerName, false);
            // players.push(p);
            games[boxId].players.push(p);
        }

        games[boxId].totalFunds += msg.value;
        emit GameChanged(boxId, games[boxId]);
    }

    // Pick the winner after some time period, can be called by everyone to be transparent,
    function pickWinner() external payable inState(State.IN_PROGRESS) {
        require(
            games[boxId].players.length > 0,
            "No players participated in the game."
        );
        require(
            block.timestamp >= games[boxId].endTime,
            "Time has not been reached yet."
        );

        uint256 winningNumber = uint256(
            keccak256(abi.encodePacked(block.difficulty, block.timestamp))
        ) % games[boxId].totalFunds;
        uint256 cumulativeWeight = 0;

        for (uint256 i = 0; i < games[boxId].players.length; i++) {
            cumulativeWeight += games[boxId].players[i].funds;
            if (winningNumber < cumulativeWeight) {
                // Set and payout the winner
                games[boxId].players[i].isWinner = true;
                address payable winner = payable(games[boxId].players[i].adr);
                winner.transfer(address(this).balance);

                games[boxId].isActive = false;

                emit GameChanged(boxId, games[boxId]);

                // reset lucky box game
                state = State.IDLE;
                boxId += 1;
            }
        }
    }

    // Get all games played
    function getAllGames() external view returns (Game[] memory) {
        Game[] memory allGames = new Game[](boxId);
        for (uint256 i = 1; i <= boxId; i++) {
            allGames[i - 1] = games[i];
        }
        return allGames;
    }
}
