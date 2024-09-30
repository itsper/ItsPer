const birdImage = new Image();
birdImage.src="ibon.png"; 


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 35,
    height: 35,
    gravity: 0.6,
    velocity: 0,
    lift: -8,
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Prevent bird from falling off the canvas
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        // Prevent bird from flying above the canvas
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    show: function() {
      // Draw the image instead of the rectangle
      ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    },
    fly: function() {
        this.velocity = this.lift;
    }
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 120;
let frameCount = 0;

function createPipes() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 20;
    pipes.push({
        x: canvas.width,
        y: pipeHeight
    });
}

function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= 2;  // Move pipes to the left

        // If pipe moves off-screen, remove it
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });
}

function detectCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
        ) {
            return true;  // Collision detected
        }
    }
    return false;
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    bird.update();
    bird.show();

    // Pipes
    if (frameCount % 90 === 0) {
        createPipes();
    }
    updatePipes();
    drawPipes();

    // Detect collision
    if (detectCollision()) {
      
        document.location.reload();
    }

    frameCount++;
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Fly on spacebar press
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.fly();
    }
}); 
//for mobile
document.addEventListener('touchstart', function() {
  bird.fly();
});