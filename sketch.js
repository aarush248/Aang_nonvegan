let bgImg, gameOverImg, winImg;
let score = 0;
let playerImage;
let playerX;
let playerY;
let playerSize;
let cabbages;
let airBalls;
let stage;
let cabbageImg, obImg, airImg;

let gameOver = false, win = false;
let health = 20;
let speedMultiplier;

let cabbageSpawnRate = 35;
let airballSpawnRate = 50;

function preload() {
    bgImg = loadImage("./Images2/earthBackground.png");
    gameOverImg = loadImage("./Images2/gameOver.png");
    winImg = loadImage("./Images2/win.png");

    playerImage = loadImage("Images2/aang.png");
    cabbageImg = loadImage("./Images2/cabbage-remove.png");
    airImg = loadImage("./Images2/airball.png");

    obImg = cabbageImg;
}

class Cabbage {
    constructor(x, speed) {
        this.x = x;
        this.y = -20;
        this.size = 90;
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }

    see() {
        image(obImg, this.x, this.y, 50, 50);
    }

    offScreen() {
        return this.y > height + this.size / 2;
    }

    touching(px, py, psize) {
        let d = dist(this.x, this.y, px, py);
        let effectiveHitbox = psize * 0.35; // smaller, tighter hitbox
        return d < (this.size / 2 + effectiveHitbox);
    }
}

class Airball {
    constructor(x, speed) {
        this.x = x;
        this.y = -20;
        this.size = 90;
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }

    see() {
        image(airImg, this.x, this.y, 50, 50);
    }

    offScreen() {
        return this.y > height + this.size / 2;
    }

    touching(px, py, psize) {
        let d = dist(this.x, this.y, px, py);
        let effectiveHitbox = psize * 0.35; // match cabbage
        return d < (this.size / 2 + effectiveHitbox);
    }
}

function setup() {
    stage = 1;
    cabbages = [];
    airBalls = [];
    score = 0;
    playerSize = 90;
    playerX = width / 2;
    playerY = 400;
    speedMultiplier = 1;

    createCanvas(500, 500);
    imageMode(CENTER); // Easier to manage collisions & placement
}

function draw() {
    if (!gameOver && !win) {
        image(bgImg, width / 2, height / 2, width, height);

        image(playerImage, playerX, playerY, playerSize, 1.5 * playerSize);

        handleInput();
        spawnObstacles();

        // Health
        fill(0);
        rect(0, 0, 120, 40);
        fill(255);
        textSize(16);
        textAlign(LEFT, TOP);
        text("Health: " + health, 10, 10);

        // Score
        fill(0);
        rect(width - 130, 0, 130, 40);
        fill(255);
        textAlign(CENTER, TOP);
        text("Score: " + score, width - 65, 10);

        // Difficulty ramping
        if (frameCount % 300 === 0 && cabbageSpawnRate > 10) {
            cabbageSpawnRate -= 5;
        }
        if (frameCount % 300 === 0 && airballSpawnRate > 20) {
            airballSpawnRate -= 5;
        }

        // Game end
        if (health <= 0) gameOver = true;
        if (score >= 50) win = true;
    } else if (gameOver) {
        image(gameOverImg, width / 2, height / 2, width, height);
    } else if (win) {
        image(winImg, width / 2, height / 2, width, height);
    }
}

function handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
        playerX -= 10;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        playerX += 10;
    }

    playerX = constrain(playerX, playerSize / 2, width - playerSize / 2);
}

function spawnObstacles() {
    // Spawn cabbages
    if (frameCount % cabbageSpawnRate === 0) {
        let cx = random(50, width - 50);
        let cspeed = random(2, 4) * speedMultiplier;
        cabbages.push(new Cabbage(cx, cspeed));
    }

    for (let i = cabbages.length - 1; i >= 0; i--) {
        cabbages[i].move();
        cabbages[i].see();

        if (cabbages[i].touching(playerX, playerY, playerSize)) {
            health--;
            cabbages.splice(i, 1);
        } else if (cabbages[i].offScreen()) {
            cabbages.splice(i, 1);
            score++;
        }
    }

    // Spawn airballs
    if (frameCount % airballSpawnRate === 0) {
        let ax = random(50, width - 50);
        let aspeed = random(2, 4) * speedMultiplier;
        airBalls.push(new Airball(ax, aspeed));
    }

    for (let i = airBalls.length - 1; i >= 0; i--) {
        airBalls[i].move();
        airBalls[i].see();

        if (airBalls[i].touching(playerX, playerY, playerSize)) {
            score++;
            airBalls.splice(i, 1);
        } else if (airBalls[i].offScreen()) {
            airBalls.splice(i, 1);
            score--;
        }
    }
}
