var game = new Phaser.Game(160, 160, Phaser.AUTO, '', { preload: preload, create: create, update: update});

//I'm following the TopDownGame tutorial for this, but trying to adjust from that programming style
//in which multiple files are used and each function is couched inside prototypes, into the simpler
//single-file format of the other tutorials. Hopefully it works.

function preload() {
	//loading the tilemap...or at least the file that tells where tiles go?
	game.load.tilemap('combinedemo', 'assets/tilemaps/combinedemo.json', null, Phaser.Tilemap.TILED_JSON);
	
	//load the image of all the tiles separately from the tile map...
	//game.load.image('gameTiles', 'assets/images/tiles.png');
	game.load.image('combined', 'assets/images/CombinedSheet.png');
	game.load.image('floor', 'assets/images/FloorTiles.png');

	//load each of the individual object's images, despite the fact that they're in
	//the tilemap/tile image... One upshot of this is that the same setup can be used
	//with different sprites, I guess, but it still seems odd.

	
	//I'm swapping out the tutorial's sprite for one of my own, with animations
	game.load.spritesheet('player', 'assets/sprites/probe1.png', 32, 32);
}
function create() {
	
	game.stage.backgroundColor = "#fff";
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//add a map/tilemap object to the game?
	map = game.add.tilemap('combinedemo');

	//provide the name of tileset from Tiled, and the 'key to the asset'
	//map.addTilesetImage('tiles', 'gameTiles');
	map.addTilesetImage('CombinedSheet', 'combined');
	map.addTilesetImage('FloorTiles', 'floor');

	//create layers
	backgroundLayer = map.createLayer('backgroundLayer'); //the 'backgroundLayer' is named in the tilemap
	blockedLayer = map.createLayer('blockedLayer'); // ""

	//collision on blockedLayer
	map.setCollisionBetween(1, 2000, true, 'blockedLayer'); // I don't know what these parameters are

	//resize the game world to match the layer dimensions
	backgroundLayer.resizeWorld();

	//createItems();
	//createDoors();

	//create the player
	//Basically, search for the 'playerStart' object, of which there should
	//be only one, and use its position as the starting coordinates for the player
	//sprite. I still don't know why it's necessary to cycle through all
	//objects and replace them with sprites, but at least I see what's happening...
	var result = findObjectsByType('playerStart', map, 'objectLayer');
	player = game.add.sprite(result[0].x, result[0].y, 'player');
	game.physics.arcade.enable(player);
	player.anchor.setTo(0.5, 0.5);
	player.scale.setTo(0.5, 0.5);
	//follow the player with the camera
	game.camera.follow(player);
	//enable cursor keys for player movement
	cursors = game.input.keyboard.createCursorKeys();

	//also enable wasd for player movement
	wasd = game.input.keyboard.addKeys({ 'up' : Phaser.KeyCode.W, 'down' : Phaser.KeyCode.S, 'left' : Phaser.KeyCode.A, 'right' : Phaser.KeyCode.D});
	//add the "rolling" animation
	player.animations.add('rolling');
}

function createItems(){
	items = game.add.group();
	items.enableBody = true;
	var item;
	result = findObjectsByType('item', map, 'objectLayer');
	result.forEach(function(element){
		createFromTiledObject(element, items);
	});
}

function findObjectsByType(type, map, layer){
	var result = new Array();
	map.objects[layer].forEach(function(element){
		if(element.properties.type === type) {
			// Phaser uses top left, Tiled bottom left, so adjustments are made here...
			element.y -= map.tileHeight;
			result.push(element);
		}
	});
	return result;
}

function createFromTiledObject(element, group) {
	var sprite = group.create(element.x, element.y, element.properties.sprite);
	//copy properties to the sprite
	Object.keys(element.properties).forEach(function(key){
		sprite[key] = element.properties[key];
	});
}

function createDoors(){
	doors = game.add.group();
	doors.enableBody = true;
	result = findObjectsByType('door', map, 'objectLayer');
	result.forEach(function(element){
		createFromTiledObject(element, doors);
	});
}

function update() {
	//player movement
	//My previous method set the velocity to specific number when
	//a key was pressed, and set it to zero otherwise. This version
	//continuously resets the velocity to zero, and adds a specific amount
	//if a key is held down. One major difference between the two strategies
	//is that I don't think this one will have the same "glitch" movement as mine,
	//but I would also imagine that this is slightly more processor intensive (only a bit, but still...)

	//There's another difference between the two methods for handling curosr movement.
	//In my previous version, the animation would keep going until a button was lifted,
	//while in this one it stops on every loop... It does bring up an interesting question about
	//animations though... telling an animation to 'play' when it's already playing doesn't do anything?
	//it doesn't interrupt or start over? I'd need a longer (and more distinctive) animation to test this.

	//A simpler way to adjust animation speed later...
	var anispeed = 40;

	player.body.velocity.y = 0;
	player.body.velocity.x = 0;
	player.animations.stop();
	if (cursors.up.isDown || wasd.up.isDown) {
		player.body.velocity.y -= 50;
		player.angle = 0;
		player.animations.play('rolling', anispeed, true);

	} else if (cursors.down.isDown || wasd.down.isDown) {
		player.body.velocity.y += 50;
		player.angle = 180;
		player.animations.play('rolling', anispeed, true);
	} else if (cursors.left.isDown || wasd.left.isDown) {
		player.body.velocity.x -= 50;
		player.angle = -90;
		player.animations.play('rolling', anispeed, true);
	} else if (cursors.right.isDown || wasd.right.isDown) {
		player.body.velocity.x += 50;
		player.angle = 90;
		player.animations.play('rolling', anispeed, true);
	}

	// One of the two major reasons for this test is next: collision based on content
	// This should work almost, if not exactly, the same was a groups, but be based on
	// which layer an object is in rather than which group... or maybe which layer *and* which group?

	game.physics.arcade.collide(player, blockedLayer); //collide with anything on the blocked layer, no matter what it is.
	//game.physics.arcade.overlap(player, items, collect, null); //overlap the player with things in the item group? I have to look at this again...
	//game.physics.arcade.overlap(player, doors, enterDoor, null); //overlap the player and doors (presumably this means an unlocked door, since we'd want collide for a locked one, right?)


}

function collect(player, collectable) {
	console.log('yummy!');
	//remove sprite (different from killing it?)
	collectable.destroy();
}

function enterDoor(player, door) {
	console.log('entering door that will take you to'+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
}