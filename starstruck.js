var game = new Phaser.Game(1000, 500, Phaser.CANVAS, 'game', 
    { preload: preload, create: create, update: update, render: render }
);

// Preloading all graphics assets
function preload() {
    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
    game.load.image('starSmall', 'assets/star.png');
    game.load.image('starBig', 'assets/star2.png');
    game.load.image('background', 'assets/background2.png');
}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1000, 500, 'background');
    // Make background move together with the "camera"
    bg.fixedToCamera = true;


    // Setting up the game scene - tilemap and corresponding images
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    // The types of tiles that are not considered for collision (minor obstacles)
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');
    // Un-comment this on to see the collision tiles
    // layer.debug = true;
    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    // make the player bounce off the ground
    player.body.bounce.y = 0.2;
    // and don't let him escape the game world
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    // Working with animations - the dude consists of multiple images,
    // and we can choose which one of them to use for a particular animation
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    // Make sure the game "camera" follows the player
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
    // Not allowing the player to run through the obstacles
    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    // Set the direction of the movement as well as the
    // animation depending on which cursor key is pressed
    // (left or right)
    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    // Only allow the player to jump when it is on the "ground" (any tile)
    // and when time for a full jump has passed (don't allow to jump immediately
    // if the player reaches the ground earlier)
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}