// modules and factories
const gameBoard = (() => {
  let _currentPlayer = 0;
  let players = [];
  let _state = [[], [], []];
  const restart = () => {
    _currentPlayer = 0;
    _state = [[], [], []];
  };
  const _empty_cells = () => {
    const cells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (_state[i][j] === undefined) {
          cells.push([i, j]);
        }
      }
    }
    return cells;
  };
  const _isFull = () => {
    const fullCellCount = _state.reduce(
      (length, row) => length + row.filter((x) => x !== undefined).length,
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
        return _state[i][0];
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
        return _state[0][i];
      } else {
        continue;
      }
    }
    return false;
  };
  const _diagonalCheck = () => {
    if (
      (_state[0][0] === _state[1][1] &&
        _state[0][0] === _state[2][2] &&
        _state[0][0] !== undefined) ||
      (_state[0][2] === _state[1][1] &&
        _state[0][2] === _state[2][0] &&
        _state[0][2] !== undefined)
    ) {
      return _state[1][1];
    } else {
      return false;
    }
  };
  const playTurn = (row, column) => {
    gameBoard.updateBoard(row, column, players[_currentPlayer].symbol);
    displayController.updateDisplay(
      row,
      column,
      players[_currentPlayer].symbol
    );
    const mode = displayController.getSelectionresult()["mode"];
    if (_isOver()) {
      displayController.end_game();
      return;
    }
    _toggleCurrentPlayer();
    if (mode.toLowerCase() === "pvai" && _currentPlayer === 1) {
      _AITurn();
    }
  };
  const _AITurn = () => {
    const empty = empty_cells();
    cell = empty[Math.floor(Math.random() * empty.length)];
    gameBoard.updateBoard(cell[0], cell[1], players[_currentPlayer].symbol);
    displayController.updateDisplay(
      cell[0],
      cell[1],
      players[_currentPlayer].symbol
    );
    if (_isOver()) {
      displayController.end_game();
      return;
    }
    _toggleCurrentPlayer();
  };
  const updateBoard = (row, column, symbol) => {
    _state[row][column] = symbol;
  };
  const setPlayers = (player1, player2) => {
    players.push(player1, player2);
  };

  const _toggleCurrentPlayer = () => {
    if (_currentPlayer === 0) {
      _currentPlayer = 1;
    } else {
      _currentPlayer = 0;
    }
    console.log(_currentPlayer);
  };
  const _isOver = () => {
    return (
      _diagonalCheck() || _horizontalCheck() || _verticalCheck() || _isFull()
    );
  };
  const isWon = () => {
    return _diagonalCheck() || _horizontalCheck() || _verticalCheck();
  };
  return {
    players,
    restart,
    playTurn,
    updateBoard,
    setPlayers,
    isWon,
  };
})();

const displayController = (() => {
  const _gameGrid = document.querySelector(".game_grid");
  const _selectionForm = document.querySelector("form");
  const _restart_btn = document.getElementById("restart");
  const _end_message = document.getElementById("congratulations");
  const initalizeDisplay = () => {
    _gameGrid.replaceChildren();
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
  const _cellClickListener = (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    gameBoard.playTurn(row, column);
  };
  const bindEventListeners = () => {
    // Cell clicking listener
    cells = _gameGrid.children;
    [...cells].forEach((cell) => {
      cell.addEventListener("click", _cellClickListener, { once: true });
    });
    // Mode selection listeners
    const inactive_btn = document.querySelector(
      "#mode_buttons>button:not(.active)"
    );
    inactive_btn.addEventListener("click", function modeSwitch(e) {
      _toggleActiveButton();
      _toggleMode();
      e.target.removeEventListener("click", modeSwitch);
      const inactive_btn = document.querySelector(
        "#mode_buttons>button:not(.active)"
      );
      inactive_btn.addEventListener("click", modeSwitch);
    });
    // Start event listener
    _selectionForm.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        _startGame();
      },
      { once: true }
    );
  };

  const _toggleActiveButton = () => {
    const buttons = document.getElementById("mode_buttons").children;
    [...buttons].map((button) => button.classList.toggle("active"));
  };
  const _toggleMode = () => {
    const inputDivs = document.querySelectorAll(".input_div");
    const pvp_inputs = document
      .querySelector(".pvp_selection")
      .querySelectorAll("input");
    const pvc_input = document
      .querySelector(".pvc_selection")
      .querySelector("input");
    if (!pvc_input.required) {
      pvc_input.required = true;
      [...pvp_inputs].map((input) => (input.required = false));
    } else {
      pvc_input.required = false;
      [...pvp_inputs].map((input) => (input.required = true));
    }
    [...inputDivs].map((div) => div.classList.toggle("hidden"));
    const nameHeader = document.getElementById("name");
    nameHeader.textContent === "Player Names:"
      ? (nameHeader.textContent = "Player Name:")
      : null;
  };

  const getSelectionresult = () => {
    const mode = _selectionForm.querySelector(".active").textContent;
    const inputFields = _selectionForm.querySelectorAll("input");
    const playerNames = [...inputFields]
      .map((input) => input.value)
      .filter((name) => name !== "");
    return { mode, playerNames };
  };
  const _startGame = () => {
    [_selectionForm, _gameGrid].map((node) => node.classList.toggle("hidden"));
    const selection = getSelectionresult();
    let player1, player2;
    if (selection.mode.toLowerCase() === "pvp") {
      player1 = player(selection.playerNames[0], "X");
      player2 = player(selection.playerNames[1], "O");
    } else {
      player1 = player(selection.playerNames[0], "X");
      player2 = player("AI", "O");
    }
    gameBoard.setPlayers(player1, player2);
  };

  const end_game = () => {
    if (gameBoard.isWon()) {
      const winner_symbol = gameBoard.isWon();
      console.log(winner_symbol);
      const winner_name =
        gameBoard.players[0].symbol === winner_symbol
          ? gameBoard.players[0].name
          : gameBoard.players[1].name;
      _end_message.textContent = `${winner_name} wins!`;
    } else {
      _end_message.textContent = "It's a tie!";
    }
    cells = _gameGrid.children;
    [...cells].forEach((cell) => {
      cell.removeEventListener("click", _cellClickListener);
    });
    _restart_btn.addEventListener("click", _restart, { once: true });
    _restart_btn.classList.toggle("hidden");
  };

  const _restart = () => {
    [_selectionForm, _gameGrid, _restart_btn].map((node) =>
      node.classList.toggle("hidden")
    );
    _end_message.textContent = "";
    _selectionForm.reset();
    gameBoard.restart();
    initalizeDisplay();
    bindEventListeners();
  };

  return {
    initalizeDisplay,
    bindEventListeners,
    updateDisplay,
    getSelectionresult,
    end_game,
  };
})();

const player = (name, symbol) => {
  return { name, symbol };
};

// global code
displayController.initalizeDisplay();
displayController.bindEventListeners();
