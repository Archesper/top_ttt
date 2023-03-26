// modules and factories
const gameBoard = (() => {
  let currentPlayer;
  let _players = [];
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
  const getCell = (row, column) => {
    return _state[row][column];
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
    getCell,
  };
})();

const displayController = (() => {
  const _gameGrid = document.querySelector(".game_grid");
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
  const toggleActiveButton = () => {
    const buttons = document.getElementById("mode_buttons").children;
    [...buttons].map((button) => button.classList.toggle("active"));
  };
  const toggleMode = () => {
    const inputDivs = document.querySelectorAll(".input_div");
    [...inputDivs].map((div) => div.classList.toggle("hidden"));
    const nameHeader = document.getElementById("name");
    nameHeader.textContent === "Player Names:"
      ? (nameHeader.textContent = "Player Name:")
      : null;
  };

  const startGame = () => {
    const selectionForm = document.querySelector("form");
    [selectionForm, _gameGrid].map((node) => node.classList.toggle("hidden"));
  };

  return {
    initalizeDisplay,
    updateDisplay,
    toggleActiveButton,
    toggleMode,
    startGame,
  };
})();

const player = (name, symbol) => {
  const playTurn = (row, column) => {
    if (gameBoard.getCell(row, column) === undefined) {
      gameBoard.updateBoard(row, column, symbol);
      displayController.updateDisplay(row, column, symbol);
      return this;
    } else {
      throw new Error("cell is full");
    }
  };
  return { name, symbol, playTurn };
};

// global code
displayController.initalizeDisplay();
