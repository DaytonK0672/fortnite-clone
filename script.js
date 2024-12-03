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
