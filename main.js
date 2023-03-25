// modules and factories
const Gameboard = (() => {
  const _gameboard = [[], [], []];
  return {};
})();

const displayController = (() => {
  const _gameGrid = document.getElementById("game_grid");
  const initalize_display = () => {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.dataset.index = i;
      _gameGrid.appendChild(cell);
    }
  };
  const update_display = (index, symbol) => {
    cellToUpdate = _gameGrid.children[index];
    cellToUpdate.textContent = symbol;
  };

  return { initalize_display, update_display };
})();

// global code
displayController.initalize_display();
