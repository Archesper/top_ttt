// modules and factories
const Gameboard = (() => {
  let _state = [[], [], []];
  const update_board = (row, column, symbol) => {
    _state[row][column] = symbol;
  };
  return { _state, update_board };
})();

const displayController = (() => {
  const _gameGrid = document.getElementById("game_grid");
  const initalize_display = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.dataset.row = i;
        cell.dataset.column = j;
        _gameGrid.appendChild(cell);
      }
    }
  };
  const update_display = (row, column, symbol) => {
    cellToUpdate = _gameGrid.querySelector(
      `[data-row="${row}"][data-column="${column}"]`
    );
    cellToUpdate.textContent = symbol;
  };

  return { initalize_display, update_display };
})();

// global code
displayController.initalize_display();
