//<script type="text/javascript">
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

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
    for (var i = 0; i < 20; i++) {

        var belt = belts.create(400, (i * 32), 'conveyor');

        //uncomment the next line and the belts will be flipped
        //so that they're scrolling up instead of down.
        //belt.scale.setTo(1,-1);

        //somehow these lines should be able to rotate the belt
        //to whatever direction I want, but it's not working
        //as expected....
        //belt.anchor.setTo(0.5,0.5);
        //belt.pivot.setTo(0,32);
        //belt.angle = 90;

        //make the belt wider
        belt.scale.setTo(4, 1);

        //Slow and fast animations for the belt.
        //They're assigned to variables here so that later we can
        //test whether they're running fast or slow.
        slow = belt.animations.add('slow', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        fast = belt.animations.add('fast', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 100, true);
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

    //Adjust the box around the player so it's the same size as the
    //image (assuming no scaling...) This should adjust the box to image size
    //which is 120 by 109, and try to center it.
    //player.body.setSize(120, 109, 55, 40);
    // The above works, but only for facing to the right...it's off center
    // for everything else!

    //Adjust the box around the player by making it a circle with a radius
    //of 40, offset so it centers on the image. This seems to work better
    //than the above, although there is some visual overlap before the
    //"overlap" function takes effect...
    player.body.setCircle(40, 60, 50);


    //Enable physics for the belt?
    game.physics.arcade.enable(belts);

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

    //Check whether the player is on top of any of the belts,
    //and if so, run "push"
    game.physics.arcade.overlap(player, belts, push, null, game);
}

//Push the player along the belt. I'd like to generalize this somehow
//so that whatever the speed of the animation is can be accommodated.
//Also, I would like to be able to have it work in any arbitrary direction
//the belt is moving.
function push(player, belt) {
    //if belts[0].
    if (slow.isPlaying) {
        player.body.velocity.y = 10;
    } else if (fast.isPlaying) {
        player.body.velocity.y = 60;
    }
    //player.body.velocity.y = 50;
}

//I don't know what render is actually for, but all the debugging examples
//on phaser.io seem to use it, so here it is.
function render() {
    //game.debug.spriteInfo(player, 30, 20);
    //show debug information for the player
    game.debug.bodyInfo(player, 40, 40);
    //show the player's surrounding box
    game.debug.body(player);

    //show the box for the belts...I couldn't figure out how to do it
    //without the forEach, so thanks for that code again!
    belts.forEach(function(belt) {
        game.debug.body(belt);
    }, this);
    //game.debug.body(belts);
}
//</script>