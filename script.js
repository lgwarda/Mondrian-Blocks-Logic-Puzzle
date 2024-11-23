const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants for grid
const GRID_SIZE = 8;
const CELL_SIZE = canvas.width / GRID_SIZE;

// Predefined black block positions (row, column)
const blackBlocks = [
    [5, 3], [5, 2], [6, 3], [6, 2], [7, 3], [7, 2],
];

// Colors and block limits
const red = '#dd0100';
const yellow = '#fac901';
const blue = '#225095';
const white = '#ffffff';
const black = '#333333';
const boardColor = 'gray';

const colors = [red, yellow, blue, white];
let draggedBlock = null;

// Block limits
const blockLimits = {
  [red]: 24,
  [yellow]: 12,
  [blue]: 9,
  [white]: 13,
};

// Grid State (tracks filled cells)
const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

function drawGrid() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            if (blackBlocks.some(([r, c]) => r === row && c === col)) {
                ctx.fillStyle = black;
            } else if (grid[row][col]) {
                ctx.fillStyle = grid[row][col];
            } else {
                ctx.fillStyle = boardColor;
            }
            
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

function drawBlocks() {
    const tray = document.getElementById('block-tray');
    tray.innerHTML = '';
    
    Object.entries(blockLimits).forEach(([color, count]) => {
        if (count > 0) {
            const block = document.createElement('div');
            block.className = 'block draggable';
            block.draggable = true;
            block.style.backgroundColor = color;
            block.style.width = `${CELL_SIZE}px`;
            block.style.height = `${CELL_SIZE}px`;
            block.dataset.color = color;

            // Desktop drag events
            block.addEventListener('dragstart', (e) => {
                draggedBlock = color;
            });

            // Touch events
            block.addEventListener('touchstart', (e) => {
                e.preventDefault();
                touchedBlock = color;
                block.style.opacity = '0.7'; // Visual feedback
            }, { passive: false });

            block.addEventListener('touchend', (e) => {
                e.preventDefault();
                block.style.opacity = '1';
            }, { passive: false });

            tray.appendChild(block);
        }
    });
}

// Handle dropping on the canvas (desktop)
canvas.addEventListener('drop', handleDrop);
canvas.addEventListener('dragover', (e) => e.preventDefault());

// Handle touch events on canvas
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

function handleDrop(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeBlock(x, y, draggedBlock);
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!touchedBlock) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    placeBlock(x, y, touchedBlock);
    touchedBlock = null;
}

function placeBlock(x, y, blockColor) {
    const row = Math.floor(y / CELL_SIZE);
    const col = Math.floor(x / CELL_SIZE);

    if (
        row >= 0 && col >= 0 && 
        row < GRID_SIZE && col < GRID_SIZE &&
        !blackBlocks.some(([r, c]) => r === row && c === col) &&
        !grid[row][col] &&
        blockColor && 
        blockLimits[blockColor] > 0
    ) {
        grid[row][col] = blockColor;
        blockLimits[blockColor] -= 1;
        drawBlocks();
        drawGrid();
    }
    
    draggedBlock = null;
}

// Add touch move handling for visual feedback
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Initialize the game
function init() {
    drawGrid();
    drawBlocks();
}

init();