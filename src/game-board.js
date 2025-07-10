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

export { gameBoard };
