// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let player = { x: 100, y: 100, width: 30, height: 30, speed: 5, color: 'blue', dx: 0, dy: 0 };
let bullets = [];
let isGameRunning = true;

// Player movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') player.dy = -player.speed;
    if (e.key === 'ArrowDown') player.dy = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Shoot bullet
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        bullets.push({ x: player.x + player.width, y: player.y + player.height / 2, width: 10, height: 5, speed: 7 });
    }
});

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    bullets.forEach(bullet => {
        bullet.x += bullet.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Update game state
function updateGame() {
    if (!isGameRunning) return;
    
    // Move player
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from going off screen
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Clear canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();

    // Repeat the update every frame
    requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();

// Player health
let playerHealth = 100;

// When the player is hit by a bullet
function checkCollision(bullet) {
    if (bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y) {
        // Damage the player
        playerHealth -= 10;
        console.log(`Player Health: ${playerHealth}`);
    }
}

// Check for bullet collision with player
function handleBullets() {
    bullets.forEach((bullet, index) => {
        checkCollision(bullet);
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) {
            bullets.splice(index, 1); // Remove bullets off-screen
        }
    });
}

// Enemy object
let enemies = [
    { x: 600, y: 100, width: 30, height: 30, color: 'red', dx: -2, health: 50 },
    { x: 700, y: 200, width: 30, height: 30, color: 'red', dx: -2, health: 50 },
];

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x += enemy.dx;  // Move the enemy
        if (enemy.x < 0) enemy.x = canvas.width;  // Respawn from right
    });
}

// Power-up object
let powerUps = [
    { x: 400, y: 300, width: 20, height: 20, color: 'green', type: 'speed' },
];

function drawPowerUps() {
    powerUps.forEach((powerUp, index) => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        // Check if player collects the power-up
        if (player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y) {
            // Grant power-up (e.g., speed boost)
            if (powerUp.type === 'speed') {
                player.speed += 2;
            }
            // Remove power-up
            powerUps.splice(index, 1);
        }
    });
}

let backgroundX = 0; // For scrolling background

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundX -= 1; // Scroll the background
    ctx.fillStyle = '#87CEEB'; // Sky color
    ctx.fillRect(backgroundX, 0, canvas.width, canvas.height);

    if (backgroundX <= -canvas.width) {
        backgroundX = 0; // Reset background position
    }
}

function drawHealthBar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(20, 20, 200, 20); // Outer health bar
    ctx.fillStyle = 'green';
    ctx.fillRect(20, 20, 200 * (playerHealth / 100), 20); // Inner health bar (based on player's health)
}

let score = 0;

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 100, 30);
}

// Client-side (script.js)
const socket = io();

// Send player movement
socket.emit('playerMove', { x: player.x, y: player.y });

// Send bullet shoot event
socket.emit('bulletShoot', { x: player.x, y: player.y });

