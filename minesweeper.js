// Configuration du jeu
const DIFFICULTY = {
    easy: { size: 8, mines: 10 },
    medium: { size: 12, mines: 20 },
    hard: { size: 16, mines: 40 }
};

// Variables globales du jeu
let board = [];
let boardSize = 12;
let mineCount = 20;
let revealedCount = 0;
let flagCount = 0;
let gameStarted = false;
let gameOver = false;
let timer = 0;
let timerInterval = null;
let currentDifficulty = 'medium';

// Initialisation du jeu au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    startGame('medium');
});

// Démarrer une nouvelle partie
function startGame(difficulty) {
    currentDifficulty = difficulty;
    const config = DIFFICULTY[difficulty];
    boardSize = config.size;
    mineCount = config.mines;

    // Réinitialiser les variables
    board = [];
    revealedCount = 0;
    flagCount = 0;
    gameStarted = false;
    gameOver = false;
    timer = 0;

    // Arrêter le chronomètre
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Mettre à jour l'affichage
    updateDisplay();
    hideGameMessage();

    // Mettre à jour les boutons de difficulté
    updateDifficultyButtons(difficulty);

    // Créer le plateau
    createBoard();
    renderBoard();
}

// Recommencer avec la même difficulté
function restartGame() {
    startGame(currentDifficulty);
}

// Mettre à jour les boutons de difficulté
function updateDifficultyButtons(active) {
    document.querySelectorAll('.difficulty-buttons .btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`.btn-${active}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Créer le plateau de jeu
function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        }
    }
}

// Placer les mines aléatoirement
function placeMines(firstClickRow, firstClickCol) {
    let minesPlaced = 0;

    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        // Ne pas placer de mine sur la première case cliquée ou ses voisins
        const isFirstClick = row === firstClickRow && col === firstClickCol;
        const isNeighbor = Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1;

        if (!board[row][col].isMine && !isFirstClick && !isNeighbor) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculer les nombres de mines adjacentes
    calculateNeighborMines();
}

// Calculer le nombre de mines adjacentes pour chaque case
function calculateNeighborMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j].isMine) {
                board[i][j].neighborMines = countAdjacentMines(i, j);
            }
        }
    }
}

// Compter les mines adjacentes à une case
function countAdjacentMines(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (isValidCell(newRow, newCol) && board[newRow][newCol].isMine) {
                count++;
            }
        }
    }

    return count;
}

// Vérifier si une case est valide
function isValidCell(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

// Afficher le plateau
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener('click', () => handleLeftClick(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(i, j);
            });

            updateCell(cell, i, j);
            gameBoard.appendChild(cell);
        }
    }
}

// Mettre à jour l'affichage d'une case
function updateCell(cellElement, row, col) {
    const cell = board[row][col];
    cellElement.className = 'cell';
    cellElement.textContent = '';

    if (cell.isFlagged) {
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
    } else if (cell.isRevealed) {
        cellElement.classList.add('revealed');

        if (cell.isMine) {
            cellElement.classList.add('mine');
            cellElement.textContent = '💣';
        } else if (cell.neighborMines > 0) {
            cellElement.classList.add(`number-${cell.neighborMines}`);
            cellElement.textContent = cell.neighborMines;
        }
    }
}

// Gérer le clic gauche (révéler)
function handleLeftClick(row, col) {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
    }

    // Premier clic : placer les mines
    if (!gameStarted) {
        gameStarted = true;
        placeMines(row, col);
        startTimer();
    }

    revealCell(row, col);

    // Mettre à jour l'affichage
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    updateCell(cellElement, row, col);
}

// Gérer le clic droit (drapeau)
function handleRightClick(row, col) {
    if (gameOver || board[row][col].isRevealed) {
        return;
    }

    board[row][col].isFlagged = !board[row][col].isFlagged;

    if (board[row][col].isFlagged) {
        flagCount++;
    } else {
        flagCount--;
    }

    // Mettre à jour l'affichage
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    updateCell(cellElement, row, col);
    updateDisplay();
}

// Révéler une case
function revealCell(row, col) {
    if (!isValidCell(row, col) || board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
    }

    board[row][col].isRevealed = true;
    revealedCount++;

    if (board[row][col].isMine) {
        gameOver = true;
        revealAllMines();
        showGameMessage('Perdu!', `Vous avez cliqué sur une mine! Temps: ${timer}s`);
        stopTimer();
        return;
    }

    // Si la case n'a pas de mines adjacentes, révéler les voisins
    if (board[row][col].neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i !== 0 || j !== 0) {
                    const newRow = row + i;
                    const newCol = col + j;

                    if (isValidCell(newRow, newCol)) {
                        revealCell(newRow, newCol);
                        const cellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                        updateCell(cellElement, newRow, newCol);
                    }
                }
            }
        }
    }

    // Vérifier la victoire
    checkWin();
}

// Révéler toutes les mines
function revealAllMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isMine) {
                board[i][j].isRevealed = true;
                const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                updateCell(cellElement, i, j);
            }
        }
    }
}

// Vérifier la victoire
function checkWin() {
    const totalCells = boardSize * boardSize;
    const safeCells = totalCells - mineCount;

    if (revealedCount === safeCells) {
        gameOver = true;
        stopTimer();
        showGameMessage('Gagné!', `Félicitations! Vous avez gagné en ${timer} secondes!`);
    }
}

// Démarrer le chronomètre
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateDisplay();
    }, 1000);
}

// Arrêter le chronomètre
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Mettre à jour l'affichage des informations
function updateDisplay() {
    document.getElementById('mine-count').textContent = mineCount;
    document.getElementById('timer').textContent = timer;
    document.getElementById('flag-count').textContent = flagCount;
}

// Afficher le message de fin de partie
function showGameMessage(title, text) {
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').textContent = text;
    document.getElementById('game-message').classList.remove('hidden');
}

// Cacher le message de fin de partie
function hideGameMessage() {
    document.getElementById('game-message').classList.add('hidden');
}
