let score = 0;
const moneyMultiplier = 100;
const speed = 1;

const gameState = {
    numCoordinates: {}
};
let randomCoord;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spritesheet('player', 'assets/images/fella-spritesheet.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('snake', 'assets/images/snake.png');
        this.load.image('gem', 'assets/images/gem.png');
    }

    create() {
        //Create and display score
        let scoreText = this.add.text(140, 610, `Treasure: $${score}`, { fontSize: '25px', fill: '#fff' });

        //Creating sprite and setting boundaries
        gameState.player = this.physics.add.sprite(240, 500, 'player').setScale(.8);
        this.physics.world.setBounds(0, 0, 480, 600);
        gameState.player.setCollideWorldBounds(true);
        gameState.player.body.collideWorldBounds(true);

        //Creating gems in random spots
        randomCoord = assignCoords();
        gameState.gem = this.physics.add.sprite(randomCoord.x, randomCoord.y, 'gem').setScale(.5);

        //Create snake sprite group
        gameState.enemies = this.physics.add.group();

        //Collision detection between player and gems
        this.physics.add.overlap(gameState.player, gameState.gem, () => {
            // Hide gem upon collecting
            gameState.gem.disableBody();
            //Move gem somewhere else on canvas
            delete gameState.numCoordinates[`x${gameState.gem.x}y${gameState.gem.y}`];
            randomCoord = assignCoords();
            //Place the gem sprite somewhere new + activate it
            gameState.gem.enableBody(true, randomCoord.x, randomCoord.y);
            // Increase score randomly
            score += (Math.round(Math.random() * 10) * moneyMultiplier);
            //Update score text
            scoreText.setText(`Earnings: \$${score}`);
            //Place snakes randomly
            randomCoord = assignCoords();
            gameState.enemies.create(randomCoord.x, randomCoord.y, 'snake').setScale(.6);
        });

        //Collision detection between player and snake
        this.physics.add.collider(gameState.player, gameState.enemies, () => this.endGame());

        //Generate random coorinates
        function generateRandomCoords() {
            const randomX = Math.floor(Math.random() * 5) * 75 + 25;
            const randomY = Math.floor(Math.random() * 5) * 75 + 25;
            return { x: randomX, y: randomY };
        }

        //Function that returns random coordinates (NOT gameState.numCoordinates)
        function assignCoords() {
            let assignCoords = generateRandomCoords();


            //Stop things being placed where there is already a game object
            while (gameState.numCoordinates[`x${assignedCoords.x}y${assignedCoords.y}`]) {
                assignedCoord = generateRandomCoords();
            }

            gameState.numCoordinates[`x${assignedCoords.x}y${assignedCoords.y}`] = true;

            return assignedCoord;
        }
    }

    update() {
        //Moving player
        const cursors = this.input.keyboard.createCursorKeys();
        // Checking whether an arrow key is pressed
        const rightArrow = cursors.right.isDown;
        const leftArrow = cursors.left.isDown;
        const upArrow = cursors.up.isDown;
        const downArrow = cursors.down.isDown;
        // If an arrow key is pressed, players moves
        if (rightArrow) {
            movePlayerRight();
        } else if (leftArrow) {
            movePlayerLeft();
        } else if (upArrow) {
            movePlayerUp();
        } else if (downArrow) {
            movePlayerDown();
        }

        // Variables to store player coordinates
        const playerXCoord = gameState.player.x;
        const playerYCoord = gameState.player.y;

        //Check player border collision
        if (bobXCoord <= 32 || bobXCoord >= 448) {
            this.endGame();
        }

        if (bobYCoord <= 32 || bobYCoord >= 568) {
            this.endGame();
        }


        //Move player in direction pressed
        function movePlayerRight() {
            gameState.player.flipX = false;
            // gameState.player.setTexture('bob-side');
            gameState.player.setVelocityX(150 * speed);
            gameState.player.setVelocityY(0);
          }
      
          function movePlayerLeft() {
            gameState.player.flipX = true;
            // gameState.player.setTexture('bob-side');
            gameState.player.setVelocityX(-150 * speed);
            gameState.player.setVelocityY(0);
          }
      
          function movePlayerUp() {
            gameState.player.flipX = false;
            // gameState.player.setTexture('bob-back');
            gameState.player.setVelocityX(0);
            gameState.player.setVelocityY(-150 * speed);
          }
      
          function movePlayerDown() {
            gameState.player.flipX = false;
            // gameState.player.setTexture('bob-front');
            gameState.player.setVelocityX(0);
            gameState.player.setVelocityY(150 * speed);
          }
    }

    //A function that ends the game
    endGame () {
        this.physics.pause();
        this.camera.main.fade(800, 0, 0, 0, false, function (camera, progress) {
            if (progress > .5) {
                this.scene.stop('GameScene');
                this.scene.start('EndScene');
            }
        });
    }
}