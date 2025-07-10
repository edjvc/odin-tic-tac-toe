import { gameController } from "./game-controller.js";
import { displayController } from "./display-controller.js";

import "./style.css";

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
  displayController.resetMessage();

  // log();
  displayController.renderPlayers();
  displayController.renderAllData();
})();
