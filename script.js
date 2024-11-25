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


// Colors for the blocks took from https://www.color-hex.com/color-palette/25374
const colors = ['#dd0100', '#fac901', '#225095', '#ffff'];
let draggedBlock = null;

// Grid State (tracks filled cells)
const grid = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(null)); // Initially, all cells are empty

// Draw the grid
function drawGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;

      // Check if the current cell is a black block
      if (blackBlocks.some(([r, c]) => r === row && c === col)) {
        ctx.fillStyle = '#333';
      } else if (grid[row][col]) {
        // Draw placed blocks
        ctx.fillStyle = grid[row][col];
      } else {
        ctx.fillStyle = 'gray';
      }

      // Draw the cell
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Draw draggable blocks
function drawBlocks() {
  const tray = document.getElementById('block-tray');
  tray.innerHTML = ''; // Clear previous blocks

  colors.forEach((color, index) => {
    const block = document.createElement('div');
    block.className = 'block draggable';
    block.draggable = true;
    block.style.backgroundColor = color;
    block.style.width = `${CELL_SIZE}px`;
    block.style.height = `${CELL_SIZE}px`;
    block.dataset.color = color;

    // Add drag events
    block.addEventListener('dragstart', (e) => {
      draggedBlock = color; // Store the dragged block's color
    });

    tray.appendChild(block);
  });
}

// Handle dropping on the canvas
canvas.addEventListener('dragover', (e) => {
  e.preventDefault(); // Allow dropping
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();

  // Get the drop position
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const row = Math.floor(y / CELL_SIZE);
  const col = Math.floor(x / CELL_SIZE);

  // Ensure the cell is valid and not occupied
  if (
    row >= 0 &&
    col >= 0 &&
    row < GRID_SIZE &&
    col < GRID_SIZE &&
    !blackBlocks.some(([r, c]) => r === row && c === col) && // Not a black block
    !grid[row][col] // Not already filled
  ) {
    grid[row][col] = draggedBlock; // Place the block
    draggedBlock = null; // Reset the dragged block
    drawGrid(); // Redraw the grid with the new block
  }
});

// Initialize the game
function init() {
  drawGrid(); // Draw the grid
  drawBlocks(); // Add blocks to the tray
}

init();
