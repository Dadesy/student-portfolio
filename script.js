let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let score = 0;

function drawHighScore(amount) {
    document.querySelector("#hi-score")
        .innerText = amount;
}

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = e => {

    const handlers = {
        'ArrowUp': () => {
            if (velocityY === 1) {
                return;
            }

            velocityX = 0;
            velocityY = -1;
        },
        'ArrowDown': () => {
            if (velocityY === -1) {
                return;
            }

            velocityX = 0;
            velocityY = 1;
        },
        'ArrowLeft': () => {
            if (velocityX === 1) {
                return;
            }

            velocityX = -1;
            velocityY = 0;
        },
        'ArrowRight': () => {
            if (velocityX === -1) {
                return;
            }

            velocityX = 1;
            velocityY = 0;
        },
    };

    if (handlers.hasOwnProperty(e.key) === true) {
        handlers[e.key]();
    }
}

function handleNewIteration() {
    if (snakeX !== foodX || snakeY !== foodY) {
        return;
    }

    updateFoodPosition();

    snakeBody.push([foodY, foodX]);

    score++;

    document.querySelector('#score').innerText = score;

    highScore = score >= highScore ? score : highScore;

    localStorage.setItem(storageKeys.highScore, highScore);

    drawHighScore(highScore);
}

function isSnakeHeadHitBody(snakeBody, i) {
    return i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0];
}

function isGameOver(snakeX, snakeY) {
    return snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30
}

function renderSnake(body, positionX, positionY) {
    for (let i = body.length - 1; i > 0; i--) {
        body[i] = body[i - 1];
    }

    body[0] = [positionX, positionY];
}

const initGame = () => {

    handleNewIteration();

    snakeX += velocityX;
    snakeY += velocityY;

    renderSnake(snakeBody, snakeX, snakeY);

    if (isGameOver(snakeX, snakeY)) {
        document.dispatchEvent(new CustomEvent('snake:game_over'));
    }

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    for (let i = 0; i < snakeBody.length; i++) {

        if (isSnakeHeadHitBody(snakeBody, i) === true) {
            document.dispatchEvent(new CustomEvent('snake:game_over'));
            return;
        }

        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    document.querySelector('.play-board').innerHTML = html;
}

const storageKeys = {
    highScore: 'snake:high_score',
};

let highScore = localStorage.getItem(storageKeys.highScore) || 0;

let foodX, foodY;

drawHighScore(highScore);

document.querySelectorAll(".controls i")
    .forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
    
updateFoodPosition();

const intervalId = setInterval(initGame, 100);

document.addEventListener('keyup', changeDirection);

document.addEventListener('snake:game_over', function (event) {
    clearInterval(intervalId);
    alert('Игра окончена. Нажмите ОК, чтобы начать заново');
    location.reload();
});