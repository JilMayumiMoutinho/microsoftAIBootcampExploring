const boardSize = 20;
const gameBoard = document.getElementById('game-board');
const livesDisplay = document.getElementById('lives');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let lives = 3;
let isPaused = false;
let gameInterval;

// Cria o tabuleiro do jogo
for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    gameBoard.appendChild(cell);
}

// Atualiza a interface do jogo
function updateBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        gameBoard.appendChild(cell);
    }

    snake.forEach((segment, index) => {
        const indexInBoard = segment.y * boardSize + segment.x;
        const cell = gameBoard.children[indexInBoard];
        if (index === 0) {
            cell.classList.add('snake-head');
        } else if (index === snake.length - 1) {
            cell.classList.add('snake-tail');
        } else {
            cell.classList.add('snake');
        }
    });

    const foodIndex = food.y * boardSize + food.x;
    gameBoard.children[foodIndex].classList.add('food');
}

// Gera comida em uma posição aleatória
function generateFood() {
    food.x = Math.floor(Math.random() * boardSize);
    food.y = Math.floor(Math.random() * boardSize);
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

// Função para mover a cobra
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Teletransporte para a parede oposta
    if (head.x < 0) head.x = boardSize - 1;
    if (head.x >= boardSize) head.x = 0;
    if (head.y < 0) head.y = boardSize - 1;
    if (head.y >= boardSize) head.y = 0;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }
}

// Verifica colisões
function checkCollisions() {
    const head = snake[0];
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        lives--;
        livesDisplay.textContent = `Vidas: ${lives}`;
        if (lives === 0) {
            alert('Game Over!');
            resetGame();
        } else {
            resetSnake();
        }
    }
}

// Reseta a posição da cobra
function resetSnake() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
}

// Reseta o jogo
function resetGame() {
    lives = 3;
    livesDisplay.textContent = `Vidas: ${lives}`;
    resetSnake();
    generateFood();
}

// Função para alternar pausa
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(gameLoop, 200);
    }
}

// Função principal do jogo
function gameLoop() {
    if (!isPaused) {
        moveSnake();
        checkCollisions();
        updateBoard();
    }
}

// Configura as direções de movimento
window.addEventListener('keydown', e => {
    switch (e.key) {
        case '8':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case '2':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case '4':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case '6':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case '5':
            togglePause();
            break;
    }
});

// Inicia o jogo
function startGame() {
    resetGame();
    gameInterval = setInterval(gameLoop, 200);
}

startGame();
