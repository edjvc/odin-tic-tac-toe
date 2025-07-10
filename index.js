function createPlayer(name, marker) {
  const _name = name;
  const _marker = marker;
  let score = 0;
  const getName = () => _name;
  const getMarker = () => _marker;
  const getScore = () => score;
  const addScore = () => score++;
  const resetScore = () => (score = 0);
  return { getName, getMarker, getScore, addScore, resetScore };
}

const gameBoard = (function () {
  const size = 3;
  const getSize = () => size;
  const board = Array.from({ length: size }, () => Array(size).fill(""));
  const resetBoard = () => {
    board.forEach((row, i) => {
      row.forEach((colume, j) => {
        board[i][j] = "";
      });
    });
  };
  const editBoard = (row, column, value) => {
    const validMarkers = ["O", "X"];
    if (
      row < size &&
      row >= 0 &&
      column < size &&
      column >= 0 &&
      validMarkers.includes(value) &&
      board[row][column] === ""
    ) {
      board[row][column] = value;
    }
  };
  const getBoard = () => board;
  return { getSize, getBoard, resetBoard, editBoard };
})();
// console.log(gameBoard);

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
    displayController.resetMessage();
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

const displayController = (function () {
  const playerOneEl = document.querySelector("#player-one");
  const playerTwoEl = document.querySelector("#player-two");
  const roundEl = document.querySelector(".round");
  const p1ScoreEl = document.querySelector("#p1-score");
  const p2ScoreEl = document.querySelector("#p2-score");
  const cells = document.querySelectorAll(".cell");
  const boardEl = document.querySelector(".board");
  const messageEl = document.querySelector("#message");
  const restartBtn = document.querySelector("#restart-btn");

  const getCells = () => cells;

  // gameController.addPlayerOne("Adam");
  // gameController.addPlayerTwo("Eve");
  const renderPlayers = () => {
    playerOneEl.textContent =
      gameController.getPlayerOne().getName() + "  (O): ";
    playerTwoEl.textContent =
      gameController.getPlayerTwo().getName() + "  (X): ";
  };

  const renderBoard = () => {
    cells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      cell.textContent = gameBoard.getBoard()[row][col];
    });
  };

  const renderAllData = () => {
    roundEl.textContent = "Round: " + gameController.getRoundNumber();
    p1ScoreEl.textContent = gameController.getPlayerOne().getScore();
    p2ScoreEl.textContent = gameController.getPlayerTwo().getScore();

    playerOneEl.removeAttribute("style");
    playerTwoEl.removeAttribute("style");

    if (gameController.getActivePlayer().getMarker() === "O") {
      playerOneEl.style.background = "yellow";
      playerOneEl.style.border = "2px solid red";
      playerOneEl.style.borderRadius = "12px";
    } else if (gameController.getActivePlayer().getMarker() === "X") {
      playerTwoEl.style.background = "yellow";
      playerTwoEl.style.border = "2px solid red";
      playerTwoEl.style.borderRadius = "12px";
    }
    renderBoard();
  };

  boardEl.addEventListener("click", (e) => {
    if (
      e.target.className === "cell" &&
      e.target.textContent === "" &&
      !gameController.gameOverState()
    ) {
      const row = parseInt(e.target.dataset.row);
      const col = parseInt(e.target.dataset.col);
      runGame.setMarker(row, col);
    }
  });

  const renderMessage = (textcontent) => {
    messageEl.textContent = textcontent;
  };

  // message should be set as a state, but I'm lazy to add it after I complete 90% of functions.
  const resetMessage = () => {
    messageEl.textContent = "";
  };

  restartBtn.addEventListener("click", () => {
    gameController.resetGame();
    renderAllData();
  });

  return {
    renderPlayers,
    renderAllData,
    renderBoard,
    getCells,
    renderMessage,
    resetMessage,
  };
})();

const runGame = (function () {
  // function log() {
  //   console.log("Round: " + gameController.getRoundNumber());
  //   console.log(
  //     "player 1: " +
  //       gameController.getPlayerOne().getName() +
  //       " [" +
  //       gameController.getPlayerOne().getScore() +
  //       "]"
  //   );
  //   console.log(
  //     "player 2: " +
  //       gameController.getPlayerTwo().getName() +
  //       " [" +
  //       gameController.getPlayerTwo().getScore() +
  //       "]"
  //   );
  //   console.table(gameBoard.getBoard());
  // }
  gameController.addPlayerOne("Adam");
  gameController.addPlayerTwo("Eve");
  // console.log("Game Start");
  gameController.resetGame();

  // log();
  displayController.renderPlayers();
  displayController.renderAllData();

  const setMarker = (r, c) => {
    if (gameController.getPlayerOne() && gameController.getPlayerTwo()) {
      gameController.setMarker(r, c);
      // console.table(gameBoard.getBoard());
      displayController.renderBoard();
      if (gameController.checkRoundResult() === "win") {
        const winner = gameController.getActivePlayer();
        // console.log(winner.getName() + " win!!");
        displayController.renderMessage(winner.getName() + " win!!");
        winner.addScore();
        setTimeout(() => {
          displayController.resetMessage();
        }, 1000);
        if (gameController.checkGameResult()) {
          // console.log(winner.getName() + " IS THE WINNER!!!");
          displayController.renderAllData();
          displayController.renderMessage(
            winner.getName() + " is the WINNER!!!"
          );
          gameController.toggleGameOver();
          return;
        }
        gameController.addRound();
        gameBoard.resetBoard();
        // log();
        displayController.renderAllData();
      } else if (gameController.checkRoundResult() === "tie") {
        // console.log("tie game");
        displayController.renderMessage("tie");
        gameController.addRound();
        gameBoard.resetBoard();
        // log();
        displayController.renderAllData();
      }
      gameController.toggleActivePlayer();
      displayController.renderAllData();
    }
  };

  return { setMarker };
})();

// runGame();
