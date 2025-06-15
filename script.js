const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle
const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 8;

// Ball
const BALL_RADIUS = 12;
const BALL_SPEED = 6;

// Scores
let playerScore = 0;
let aiScore = 0;

// Paddle positions
let playerY = (HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (HEIGHT - PADDLE_HEIGHT) / 2;

// Ball state
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(Math.min(playerY, HEIGHT - PADDLE_HEIGHT), 0);
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = 40) {
    ctx.fillStyle = '#fafafa';
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function resetBall(direction = 1) {
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
    ballVX = BALL_SPEED * direction * (Math.random() > 0.5 ? 1 : -1);
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function update() {
    // Move ball
    ballX += ballVX;
    ballY += ballVY;

    // Wall collision (top/bottom)
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballVY *= -1;
    } else if (ballY + BALL_RADIUS > HEIGHT) {
        ballY = HEIGHT - BALL_RADIUS;
        ballVY *= -1;
    }

    // Paddle collision (player)
    if (
        ballX - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS;
        ballVX *= -1.1; // reflect and increase speed
        // Add a bit of vertical speed depending on where it hit the paddle
        let collidePoint = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballVY = collidePoint * 0.25;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_RADIUS > WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS;
        ballVX *= -1.1;
        let collidePoint = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballVY = collidePoint * 0.25;
    }

    // Score
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall(1);
    }
    if (ballX + BALL_RADIUS > WIDTH) {
        playerScore++;
        resetBall(-1);
    }

    // AI movement (simple proportional controller)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 10) {
        aiY += PADDLE_SPEED * 0.7;
    } else if (aiCenter > ballY + 10) {
        aiY -= PADDLE_SPEED * 0.7;
    }
    aiY = Math.max(Math.min(aiY, HEIGHT - PADDLE_HEIGHT), 0);
}

function render() {
    // Clear
    drawRect(0, 0, WIDTH, HEIGHT, '#222');
    // Center line
    for (let y = 0; y < HEIGHT; y += 36) {
        drawRect(WIDTH / 2 - 2, y, 4, 24, '#444');
    }
    // Paddles
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#2ecc40');
    drawRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#ff4136');
    // Ball
    drawCircle(ballX, ballY, BALL_RADIUS, '#fafafa');
    // Scores
    drawText(playerScore, WIDTH / 4, 60);
    drawText(aiScore, WIDTH * 3 / 4, 60);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
