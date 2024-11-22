
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants for grid
const GRID_SIZE = 8; // 8x8 grid
const CELL_SIZE = canvas.width / GRID_SIZE; // Calculate cell size based on canvas dimensions

// Predefined black block positions (row, column)
const blackBlocks = [
    [5, 3], 
    [5, 2], 
    [6, 3], 
    [6, 2], 
    [7, 3], 
    [7, 2],
];

// Colors for the blocks
const colors = ['red', 'yellow', 'blue', 'white'];

// Draw the grid
function drawGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Check if the current cell is a black block
      if (blackBlocks.some(([r, c]) => r === row && c === col)) {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'white';
      }

      // Draw the cell
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Initialize the game board
drawGrid();


