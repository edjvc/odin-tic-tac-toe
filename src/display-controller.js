import { gameController } from "./game-controller.js";
import { gameBoard } from "./game-board.js";

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

  function handleClickSetMarker(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    const cellIsEmpty = gameBoard.getBoard()[row][col] === "";

    if (
      gameController.getPlayerOne() &&
      gameController.getPlayerTwo() &&
      e.target.className === "cell" &&
      !gameController.gameOverState() &&
      cellIsEmpty
      // e.target.textContent === ""
    ) {
      gameController.setMarker(row, col);
      renderBoard();
      if (gameController.checkRoundResult() === "win") {
        const winner = gameController.getActivePlayer();
        winner.addScore();
        if (gameController.checkGameResult()) {
          renderAllData();
          renderMessage(winner.getName() + " is the WINNER!!!");
          gameController.toggleGameOver();
          return;
        } else {
          renderMessage(winner.getName() + " win!!");
          setTimeout(() => {
            resetMessage();
          }, 1000);
          gameController.addRound();
          gameBoard.resetBoard();
          renderAllData();
        }
      } else if (gameController.checkRoundResult() === "tie") {
        renderMessage("tie");
        setTimeout(() => {
          resetMessage();
        }, 1000);
        gameController.addRound();
        gameBoard.resetBoard();
        renderAllData();
      }
      gameController.toggleActivePlayer();
      renderAllData();
    }
  }

  boardEl.addEventListener("click", handleClickSetMarker);

  const renderMessage = (textcontent) => {
    messageEl.textContent = textcontent;
  };

  // message should be set as a state, but I'm lazy to add it after I complete 90% of functions.
  const resetMessage = () => {
    messageEl.textContent = "";
  };

  restartBtn.addEventListener("click", () => {
    gameController.resetGame();
    resetMessage();
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

export { displayController };
