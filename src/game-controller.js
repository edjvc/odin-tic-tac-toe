import { createPlayer } from "./create-player.js";
import { gameBoard } from "./game-board.js";

const gameController = (function () {
  let playerOne = null;
  let playerTwo = null;

  const addPlayerOne = (name) => {
    playerOne = createPlayer(name, "O");
  };
  const addPlayerTwo = (name) => {
    playerTwo = createPlayer(name, "X");
  };

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;

  const board = gameBoard.getBoard();
  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;
  const toggleActivePlayer = () => {
    if (activePlayer === playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
  };
  let round = 1;
  const getRoundNumber = () => round;
  const addRound = () => round++;
  const setMarker = (row, column) => {
    gameBoard.editBoard(row, column, activePlayer.getMarker());
  };

  const checkRoundResult = () => {
    const size = gameBoard.getSize();

    function checkDirections(startRow, startColumn) {
      const moveDirections = [
        [0, 1],
        [1, 0],
        [-1, 1],
        [1, 1],
      ];
      for (let [moveRow, moveColumn] of moveDirections) {
        let count = 0;

        for (let i = 0; i < size; i++) {
          const targetRow = startRow + moveRow * i;
          const targetColumn = startColumn + moveColumn * i;
          if (
            targetRow < 0 ||
            targetRow >= size ||
            targetColumn < 0 ||
            targetColumn >= size
          ) {
            break;
          }
          if (board[targetRow][targetColumn] === activePlayer.getMarker()) {
            count++;
          } else break;
        }

        if (count === 3) return true;
      }
    }

    // checkActiveMarker
    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        if (board[row][column] === activePlayer.getMarker()) {
          const result = checkDirections(row, column);
          if (result) return "win";
        }
      }
    }
    if (board.flat().every((item) => item !== "")) return "tie";
  };

  const checkGameResult = () => {
    const winningScore = 3;
    if (activePlayer.getScore() === winningScore) {
      return true;
    }
  };

  let gameOver = false;
  const gameOverState = () => gameOver;
  const toggleGameOver = () => {
    if (gameOver === false) {
      gameOver = true;
    } else {
      gameOver = false;
    }
  };

  const resetGame = () => {
    gameOver = false;
    round = 1;
    activePlayer = playerOne;
    gameBoard.resetBoard();
    playerOne.resetScore();
    playerTwo.resetScore();
  };

  return {
    addPlayerOne,
    addPlayerTwo,
    getPlayerOne,
    getPlayerTwo,
    getActivePlayer,
    getRoundNumber,
    setMarker,
    checkRoundResult,
    toggleActivePlayer,
    addRound,
    checkGameResult,
    resetGame,
    gameOverState,
    toggleGameOver,
  };
})();

export { gameController };
