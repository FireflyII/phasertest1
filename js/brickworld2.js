var game = new Phaser.Game(160, 160, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    //loading the tilemap
    //This is the file that lists where all of the tiles will go, functionally drawing the world.
    game.load.tilemap('combinedemo', 'assets/tilemaps/combinedemo.json', null, Phaser.Tilemap.TILED_JSON);

    //loading the images
    //We need all the source images for the tilemap to use, and to label them so they can be applied later.
    game.load.image('combined', 'assets/images/CombinedSheet.png');
    game.load.image('floor', 'assets/images/FloorTiles.png');
    game.load.image('treeset', 'assets/images/tree.png');

    /* 
     * Images for any objects (things on the object layer to be interacted with)
     * should also be loaded here. There aren't any at the moment, but this is where
     * they would go.
     */

    //load the sprites
    //The player uses a sprite, rather than an image. Mainly this is so that it can be animated.
    // -- If it were a static image, maybe it wouldn't need to be a sprite? This is still fuzzy
    // -- in regards to the object layer vs tile layer stuff...
    game.load.spritesheet('player', 'assets/sprites/probe1.png', 32, 32);
    game.load.spritesheet('openable', 'assets/images/wallOpening2.png', 32, 32);
}

function create() {

    //Set up the game environment
    game.stage.backgroundColor = "#fff";
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //create a 'map' object from the tilemap loaded earlier
    map = game.add.tilemap('combinedemo');

    //add the tile sets loaded earlier to the map, basically telling it which
    //image (loaded above) goes with which named tileset in the tilemap file.
    // -- This seems redundant to me, since the path to the image file is already
    // -- in the json file, but so be it.
    map.addTilesetImage('CombinedSheet', 'combined');
    map.addTilesetImage('FloorTiles', 'floor');
    map.addTilesetImage('tree', 'treeset');

    //create layers
    /* The order matters here. The background comes first, with everything
     * that's going to be behind everything else, with no interaction. The blocked
     * layer comes next, sitting on top of (or in front of) the background layer,
     * and consists of any walls/obstacles we'll be having the player be 'blocked' by.
     * Next is the object layer, which is a little different (more later), where the player
     * is, and finally an upper layer (placed later in the code so it will be after the object layer)
     * that works just like the background layer (no interactions) but sits on top of everything else.
     * All of these layers can be named anything, and how they are used (interaction or not)
     * is determined here in Phaser, but they'll be drawn in the order they're listed in this code.
     */
    backgroundLayer = map.createLayer('backgroundLayer'); //the 'backgroundLayer' is named in the tilemap
    blockedLayer = map.createLayer('blockedLayer'); // ""

    //collision on blockedLayer
    map.setCollisionBetween(1, 2000, true, 'blockedLayer'); // I don't know what these parameters are

    //resize the game world to match the layer dimensions
    // -- I *think* this makes it zoom in? I'm not sure...
    backgroundLayer.resizeWorld();

    //createItems();
    //createDoors();

    //create the player
    //Basically, search for the 'playerStart' object, of which there should
    //be only one, and use its position as the starting coordinates for the player
    //sprite. 
    var result = findObjectsByType('playerStart', map, 'objectLayer');
    player = game.add.sprite(result[0].x, result[0].y, 'player');
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.5, 0.5);

    //place the openable wall, which is also a sprite on the object layer*
    var r2 = findObjectsByType('secret', map, 'objectLayer');
    openwall = game.add.sprite(r2[0].x, r2[0].y, 'openable');
    game.physics.arcade.enable(openwall);
    openwall.body.immovable =true;
    openanimation = openwall.animations.add('opening');

    //follow the player with the camera
    game.camera.follow(player);

    //enable cursor keys for player movement
    cursors = game.input.keyboard.createCursorKeys();

    //also enable wasd for player movement
    wasd = game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D });

    //add the "rolling" animation 
    player.animations.add('rolling');

    //add the upper layer (see above)
    upperLayer = map.createLayer('upperLayer');
}

function createItems() {
    //create a group called 'items' and turn on physics for everything in it
    items = game.add.group();
    items.enableBody = true;
    var item;
    //create an array of objects found on the object layer with 'type' listed as 'item'
    //(see comment for findObjectByType), then add each instance found to the items group.
    result = findObjectsByType('item', map, 'objectLayer');
    result.forEach(function(element) {
        createFromTiledObject(element, items);
    });
}
/*
 * This function comes from a tutorial, but the Phaser documentation hints at needing
 * to do this one way or another, so we'll keep it.
 * 
 * Basically, this function is passed a tag for the 'type' property that
 * is added to objects in Tiled to identify them as one kind or another (item, door, etc.)
 * along with the map object, and the name of layer to look in. It returns an array
 * of all the objects it finds that match.
 */
function findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
        if (element.properties.type === type) {
            // Phaser uses top left, Tiled bottom left, so adjustments are made here...
            element.y -= map.tileHeight;
            result.push(element);
        }
    });
    return result;
}

/*
 * This also comes from the tutorial, and may be replaced with Phaser's built-in
 * Tilemap.createFromObjects later once I figure out what the difference is...
 */
function createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    //copy properties to the sprite
    Object.keys(element.properties).forEach(function(key) {
        sprite[key] = element.properties[key];
    });
}

function createDoors() {
    doors = game.add.group();
    doors.enableBody = true;
    result = findObjectsByType('door', map, 'objectLayer');
    result.forEach(function(element) {
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

    game.physics.arcade.collide(player, blockedLayer, hitwall, null); //collide with anything on the blocked layer, no matter what it is.
    
    game.physics.arcade.collide(player, openwall, wallopen, null); // when hit, open the wall

    //game.physics.arcade.overlap(player, items, collect, null); //overlap the player with things in the item group? I have to look at this again...
    //game.physics.arcade.overlap(player, doors, enterDoor, null); //overlap the player and doors (presumably this means an unlocked door, since we'd want collide for a locked one, right?)


}

function wallopen(player, wall){
	//stop the player's motion temporarily
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	//animate the wall opening up
	openwall.animations.play('opening', 4, false, true); // play the animation at 4 fps, don't loop, and destroy the sprite at the end
	console.log('opening the wall');
    //replace the floor tile so the shadow is gone.
    //for the moment, these are specific tile locations because there's only one
    //instance. I'll try to generalize it shortly.
    map.putTile(map.getTile(13,8,0), 13, 7, 0); //take the tile at 13,8 on layer 0 (the background)
                                                //and put a copy at 13,7 also layer 0.
}
function hitwall(player, wallpart){
	//testing to see if we can identify parts of the wall when we run into them!
	console.log('Ran into wall at X:'+wallpart.x+' Y:'+wallpart.y);
}
function collect(player, collectable) {
    console.log('yummy!');
    //remove sprite (different from killing it?)
    collectable.destroy();
}

function enterDoor(player, door) {
    console.log('entering door that will take you to' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
}