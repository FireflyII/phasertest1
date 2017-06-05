var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
	console.log('preload');
	game.load.spritesheet('probe', 'assets/sprites/probe1.png', 32, 32);
	game.stage.backgroundColor = "#fff";
}

function create() {
	//enable Arcade Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	player = game.add.sprite(game.world.centerX, game.world.centerY, 'probe');

	//enable physics for player
	game.physics.arcade.enable(player);
	player.anchor.setTo(0.5, 0.5);

	//add the "rolling" animation
	player.animations.add('rolling');
	//add keyboard support
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	if (cursors.left.isDown){
		player.angle = -90;
		player.animations.play('rolling', 40, true);
		player.body.velocity.x = -100;
	} else if (cursors.right.isDown) {
		player.angle = 90;
		player.animations.play('rolling', 40, true);
		player.body.velocity.x = 100;
	} else if (cursors.down.isDown) {
		player.angle = 180;
		player.animations.play('rolling', 40, true);
		player.body.velocity.y = 100;
	} else if (cursors.up.isDown) {
		player.angle = 0;
		player.animations.play('rolling', 40, true);
		player.body.velocity.y = -100;
	} else {
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.animations.stop();
	}
}

function render() {

}