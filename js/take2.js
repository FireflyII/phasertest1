//<script type="text/javascript">
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('conveyor', 'assets/sprites/conveyor1.png', 32, 32)
    console.log('preload');
    game.stage.backgroundColor = "#fff";

}

function create() {
    belts = game.add.group();
    for (var i = 0; i < 5; i++) {
        var belt = belts.create(0, i * 32, 'conveyor');
        belt.animations.add('slow', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        belt.animations.add('fast', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 20, true);
        belt.animations.play('slow');
    }
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
}
//</script>