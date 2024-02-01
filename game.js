const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const basketWidth = 50;
const basketHeight = 50;
const basketImage = new Image();
basketImage.src = 'basket.png'; // Path to the basket image

let basketX = canvas.width / 2 - basketWidth / 2;
let basketY = canvas.height - basketHeight - 10;
let basketReady = false;

const background = new Image();
background.src = 'background.png'; // Path to the background image
let backgroundReady = false;

const nuggetImage = new Image();
nuggetImage.src = 'nugget.png'; // Path to the nugget image

const bombWidth = 20;
const bombHeight = 20;
const bombSpeed = 2;
let bombs = [];
const bombImage = new Image();
bombImage.src = 'bomb.png'; // Path to the bomb image

const nuggetSpeed = 1;

const basketSpeed = 10; // Speed of basket movement

let nuggets = [];
let score = 0;

let startTime = Date.now();
let spawnTimer = Date.now();

const collectSound = new Audio('collect_sound.mp3'); // Path to the collecting sound effect

function playCollectSound() {
    collectSound.currentTime = 0; // Reset the sound to the beginning
    collectSound.play(); // Play the sound
}

const bombSound = new Audio('bomb_sound.mp3'); // Path to the bomb sound effect

function playBombSound() {
    bombSound.currentTime = 0; // Reset the sound to the beginning
    console.log(bombSound.volume);
    bombSound.volume = .2;
    bombSound.play(); // Play the sound
}

basketImage.onload = function() {
    basketReady = true;
    draw();
};

background.onload = function() {
    backgroundReady = true;
    draw();
};

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawBasket() {
    if (basketReady) {
        ctx.drawImage(basketImage, basketX, basketY, basketWidth, basketHeight);
    }
}

function drawNuggets() {
    for (let nugget of nuggets) {
        ctx.drawImage(nuggetImage, nugget.x, nugget.y, nugget.width, nugget.height);
    }
}

function drawBombs() {
    for (let bomb of bombs) {
        ctx.drawImage(bombImage, bomb.x, bomb.y, bombWidth, bombHeight);
    }
}

function updateNuggets() {
    for (let i = nuggets.length - 1; i >= 0; i--) {
        let nugget = nuggets[i];
        nugget.y += nuggetSpeed;
        if (nugget.y > canvas.height) {
            // Remove nugget if it goes out of the play space
            nuggets.splice(i, 1);
        } else if (nugget.y + nugget.height >= basketY && nugget.x >= basketX && nugget.x <= basketX + basketWidth) {
            // Nugget collected
            score += nugget.points; // Add points based on nugget size
            playCollectSound(); // Play the collecting sound
            nuggets.splice(i, 1); // Remove nugget from array
        }
    }
}

function playCollectSound() {
    collectSound.currentTime = 0; // Reset the sound to the beginning
    collectSound.play(); // Play the sound
}

function updateBombs() {
    for (let i = bombs.length - 1; i >= 0; i--) {
        let bomb = bombs[i];
        bomb.y += bombSpeed;
        if (bomb.y > canvas.height) {
            // Remove bomb if it goes out of the play space
            bombs.splice(i, 1);
        } else if (bomb.y + bombHeight >= basketY && bomb.x >= basketX && bomb.x <= basketX + basketWidth) {
            // Bomb touched the basket
            score -= 10; // Deduct points
            playBombSound(); // Play the bomb sound
            bombs.splice(i, 1); // Remove bomb from array
        }
    }
}

function spawnBomb() {
    const x = Math.random() * (canvas.width - bombWidth);
    const bomb = { x, y: -bombHeight };
    bombs.push(bomb);
}

function spawnNugget() {
    const size = Math.floor(Math.random() * 20) + 10; // Random size between 10 and 30
    const x = Math.random() * (canvas.width - size);
    const nugget = { x, y: -size, width: size, height: size, points: size }; // Larger pieces are worth more points
    nuggets.push(nugget);
}

function drawScore() {
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    ctx.fillStyle = 'white'; // Set text color to white
    ctx.font = '20px Arial';
    ctx.fillText('Time: ' + elapsedTime + 's', canvas.width - 150, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawBasket();
    drawNuggets();
    drawBombs(); // Draw bombs
    drawScore();
    drawTimer();

    requestAnimationFrame(draw);
}

function update() {
    updateNuggets();
    updateBombs(); // Update bombs

    if (Date.now() - spawnTimer > 2000) {
        spawnNugget();
        spawnBomb(); // Spawn bombs
        spawnTimer = Date.now();
    }

    requestAnimationFrame(update);
}

draw();
update();

document.addEventListener('keydown', function(event) {
    if (!basketReady) return;
    switch (event.key) {
        case 'ArrowUp':
            moveBasket('up');
            break;
        case 'ArrowDown':
            moveBasket('down');
            break;
        case 'ArrowLeft':
            moveBasket('left');
            break;
        case 'ArrowRight':
            moveBasket('right');
            break;
    }
});

function moveBasket(direction) {
    switch (direction) {
        case 'up':
            basketY -= basketSpeed;
            break;
        case 'down':
            basketY += basketSpeed;
            break;
        case 'left':
            basketX -= basketSpeed;
            break;
        case 'right':
            basketX += basketSpeed;
            break;
    }

    basketX = Math.max(0, Math.min(canvas.width - basketWidth, basketX));
    basketY = Math.max(0, Math.min(canvas.height - basketHeight, basketY));

    checkBombCollision(); // Check for bomb collision after moving the basket
}

function checkBombCollision() {
    for (let bomb of bombs) {
        if (bomb.y + bombHeight >= basketY && bomb.x >= basketX && bomb.x <= basketX + basketWidth) {
            // Bomb touched the basket
            bombs = bombs.filter(b => b !== bomb);
            score -= 10; // Deduct points
            playBombSound(); // Play the bomb sound
        }
    }
}
