// modules and factories
const gameBoard = (() => {
  let _state = [[], [], []];
  const _isFull = () => {
    const fullCellCount = _state.reduce(
      (length, row) => length + row.length,
      0
    );
    return fullCellCount === 9;
  };

  const _horizontalCheck = () => {
    for (let i = 0; i < 3; i++) {
      if (
        _state[i][0] === _state[i][1] &&
        _state[i][0] === _state[i][2] &&
        _state[i][0] !== undefined
      ) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  };
  const _verticalCheck = () => {
    for (let i = 0; i < 3; i++) {
      if (
        _state[0][i] === _state[1][i] &&
        _state[0][i] === _state[2][i] &&
        _state[0][i] !== undefined
      ) {
        return true;
      } else {
        continue;
      }
    }
    return false;
  };
  const _diagonalCheck = () => {
    return (
      (_state[0][0] === _state[1][1] &&
        _state[0][0] === _state[2][2] &&
        _state[0][0] !== undefined) ||
      (_state[0][2] === _state[1][1] &&
        _state[0][2] === _state[2][0] &&
        _state[0][2] !== undefined)
    );
  };
  const updateBoard = (row, column, symbol) => {
    _state[row][column] = symbol;
  };
  const isOver = () => {
    return (
      _diagonalCheck() || _horizontalCheck() || _verticalCheck() || _isFull()
    );
  };
  return {
    updateBoard,
    isOver,
  };
})();

const displayController = (() => {
  const _gameGrid = document.getElementById("game_grid");
  const initalizeDisplay = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.dataset.row = i;
        cell.dataset.column = j;
        _gameGrid.appendChild(cell);
      }
    }
  };
  const updateDisplay = (row, column, symbol) => {
    cellToUpdate = _gameGrid.querySelector(
      `[data-row="${row}"][data-column="${column}"]`
    );
    cellToUpdate.textContent = symbol;
  };

  return { initalizeDisplay, updateDisplay };
})();

// global code
displayController.initalizeDisplay();
