//<script type="text/javascript">
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('conveyor', 'assets/sprites/conveyor1.png', 32, 32);
    game.load.spritesheet('player', 'assets/sprites/Roller1.png', 192, 192);
    console.log('preload');
    game.stage.backgroundColor = "#fff";

}
//var belts = game.add.group();
function create() {
    // enable Arcade Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    belts = game.add.group();
    for (var i = 0; i < 5; i++) {
        var belt = belts.create(0, i * 32, 'conveyor');
        belt.animations.add('slow', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        belt.animations.add('fast', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 100, true);
        belt.animations.play('slow');

    }

    //Add the player's sprite and animations:
    player = this.game.add.sprite(50, 50, 'player');
    player.scale.setTo(0.5, 0.5);
    player.animations.add('up', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [4, 5, 6, 7], 10, true);
    player.animations.add('down', [8, 9, 10, 11], 10, true);
    player.animations.add('left', [12, 13, 14, 15], 10, true);

    //Enable physics for the player
    game.physics.arcade.enable(player);

    //Add keyboard support:
    cursors = game.input.keyboard.createCursorKeys();
    /*
    for (var i=0; i < 5; i++){
    	belt1 = this.game.add.sprite(0, i*32, 'conveyor');
    	//belt1.create(32,0);
    	//belt1.scale.setTo(4,4);
    	belt1.animations.add('slow', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    	belt1.animations.play('slow');
    }
    */
    console.log('create');

}

function update() {
    if (game.input.activePointer.justPressed()) {
        belts.callAll('play', null, 'fast');
        //belts.forEach(animations.play('fast'));
    }

    //Simple movement...
    if (cursors.left.isDown) {
        player.body.velocity.x = -50;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 50;
        player.animations.play('right');
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 50;
        player.animations.play('down');
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -50;
        player.animations.play('up');
    } else {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.animations.stop();
    }

}
//</script>