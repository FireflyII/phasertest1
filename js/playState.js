//play
//cond = "", clearCourse && (cond += "C"), clearPossibilities && (cond += "Po"), clearProgress && (cond += "Pr"), clearGoalreaching && (cond += "G");
//d = new Date();
//fname = 'logs/' + cond + '_' + fname + d.getTime().toString() + '.txt';

var playState = {
    // Set the name for the file to save the logs to
    // by taking a name from the php form and adding in
    // the directory and file extension 
    // Also add in a timestamp and a condition code (to know which conditions are set)



    preload: function() {
        // Import all of the resources for the game, namely the tilemap
        // and images

        // The tilemap is a json file created by Tiled that tells the game
        // where all the tiles go, as well as a few other important properties.
        game.load.tilemap('buttonworld', 'assets/tilemaps/buttonworld.json', null, Phaser.Tilemap.TILED_JSON);

        // Load tiles
        game.load.image('Tileset', 'assets/images/Tileset.png');
        game.load.image('shade', 'assets/images/Shade.png');

        // Load images for dialog boxes, and text
        game.load.image('InstBack', 'assets/images/InstBack.png');
        game.load.image('InstFront', 'assets/images/InstFront.png');
        game.load.image('over1', 'assets/images/over1.png');
        game.load.image('over2', 'assets/images/over2.png');
        game.load.image('pbar1', 'assets/images/pbar1.png');
        game.load.image('pbar2', 'assets/images/pbar2.png');
        game.load.image('db', 'assets/images/Dialog Box.png');
        game.load.image('close', 'assets/images/close.png');
        // Load sprites (anything that will be animated)
        game.load.spritesheet('player', 'assets/sprites/probe1.png', 32, 32);
        game.load.spritesheet('openable', 'assets/sprites/wallOpening2.png', 32, 32);
        game.load.spritesheet('blueButton', 'assets/sprites/BlueButton.png', 32, 32);
        game.load.spritesheet('open2', 'assets/sprites/LowerWallOpener.png', 32, 32);
        game.load.spritesheet('redButton', 'assets/sprites/RedButton.png', 32, 32);
        game.load.spritesheet('scroll', 'assets/sprites/Scroll.png', 32, 32);
        game.load.spritesheet('progbar', 'assets/sprites/progressbar.png', 96, 96);
        // Load sound effect(s)
        game.load.audio('click', 'assets/audio/Button_Press.mp3');

    },

    create: function() {
        /*Set up the game environment by defining the scale and placement of the game,
        starting the physics engine, linking the tileset to the map, establishing collision rules,
        placing the interactive objects, creating listeners for the controls, etc.
        */
        game.scale.setGameSize(200, 200);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Start a timer to log data every X seconds
        //game.time.events.loop(Phaser.Timer.SECOND * 10, this.logData, this);
        logging = true;

        // Start a timer for inactiivty that will end the game if nothing happens for a while
        game.time.events.loop(Phaser.Timer.SECOND * 30, this.checkActive, this);
        active = true;
        //Set up the game environment
        game.stage.backgroundColor = "#fff";
        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //create a 'map' object from the tilemap loaded earlier
        map = game.add.tilemap('buttonworld');

        // Add the tileset to the map
        map.addTilesetImage('Tileset', 'Tileset');

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

        // Make sure the player 'collides' with things on the blocked layer
        map.setCollisionBetween(1, 2000, true, 'blockedLayer'); // I don't know what these parameters are

        //resize the game world to match the layer dimensions
        backgroundLayer.resizeWorld();

        //insert the blue button(s)
        var r3 = this.findObjectsByType('button', map, 'objectLayer');
        button = game.add.sprite(r3[0].x, r3[0].y, 'blueButton');
        game.physics.arcade.enable(button);

        //create a group for the openable walls
        walls = game.add.group();
        walls.enableBody = true;
        walls.physicsBodyType = Phaser.Physics.ARCADE;

        /* Create red buttons.
         * This makes a group for the red buttons called rBs, and creates
         * new sprites for each 'redButton' instance found on the object layer.
         * It adjusts the size, sets the button so it won't move, and tacks
         * on the extra parameters for the wall coordinates to open.
         */
        rBs = game.add.group();
        rBs.enableBody = true;
        rBs.physicsBodyType = Phaser.Physics.ARCADE;

        var rBi = this.findObjectsByType('redButton', map, 'objectLayer');
        rBi.forEach(function(bt) {
            var rB = rBs.create(bt.x, bt.y + bt.properties.height, 'redButton');
            rB.width = bt.properties.width;
            rB.height = bt.properties.height;
            rB.opensX = bt.properties.opensX;
            rB.opensY = bt.properties.opensY;
            rB.LED = map.getTile(bt.properties.LEDX, bt.properties.LEDY, 1);
            rB.body.immovable = true;
        });

        // Create the player by finding where the object was placed on the map
        // and placing a sprite there
        var result = this.findObjectsByType('playerStart', map, 'objectLayer');
        player = game.add.sprite(result[0].x, result[0].y, 'player');
        game.physics.arcade.enable(player);
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(0.5, 0.5);
        player.body.collideWorldBounds = true; // stay in the game!

        //follow the player with the camera
        game.camera.follow(player);

        //enable cursor keys for player movement
        cursors = game.input.keyboard.createCursorKeys();

        //also enable wasd for player movement
        wasd = game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D });

        //enable spacebar for use in closing the instruction window.
        k = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        k.onDown.add(this.closeInst, this);

        //add the "rolling" animation 
        player.animations.add('rolling');

        //add the upper layer (see above)
        upperLayer = map.createLayer('upperLayer');

        //add the blocked out layer
        darkLayer = map.createLayer('darkLayer');

        //Create an array for data logging
        hist = [];

        //create a block that is locked to the player, but larger,
        //and destroys the dark tiles when they collide, revealing the map
        //over time

        see = player.addChild(game.make.sprite(0, 0, 'shade'));
        see.anchor.setTo(0.5, 0.5);
        see.scale.setTo(2, 2);
        game.physics.arcade.enable(see);
        see.alpha = 0;

        //An alternative approach to the above is to create a circular mask
        //around the player that applies to the dark layer. This way, the map
        //stays hidden beyond the player's limited field of view, and isn't
        //revealed over time.
        // if (!clearCourse) {
        //     see = player.addChild(game.add.graphics(0, 0));
        //     see.beginFill(0xffffff);
        //     see.drawCircle(0, 0, 200);
        //     darkLayer.visible=false;
        //     game.stage.mask = see;
        // }
        //give all the dark tiles a 'collision' function so they'll dissapear when
        //the player reaches them

        ts = darkLayer.getTiles(0, 0, 1280, 1280); //return a list of all tiles within the rectangle formed by the pixel coordinates given (the whole world, here)
        ts.forEach(function(tl) {
            tl.setCollisionCallback(playState.lightup, this);
        });

        //Create the progress bar
        //Both the progress bar and the map covering can be running in all cases,
        //but with their visibility toggled for each condition. That way, there shouldn't
        //be any performance differences, because the same code will be running.

        pbar = game.add.sprite(230, 192, 'progbar');
        pbar.scale.setTo(0.5, 0.5);
        pbar.fixedToCamera = true;
        pbar.cameraOffset.x = 0;
        pbar.cameraOffset.y = 0;

        // set the 'movement state' so we can use arrow keys for different purposes at different times
        mstate = 1;

        clickSound = game.add.audio('click');
    },

    update: function() {
        //This will probably move to the 'create' function once deployed, but is here for testing
        //purposes so that we can toggle things while the game is running.
        if (clearProgress) {
            pbar.visible = true;
        } else {
            pbar.visible = false;
        }
        if (clearCourse) {
            darkLayer.visible = false;
        } else {
            darkLayer.visible = true;
        }
        //********* Log the following on every update:
        //      player's x coordinate
        //      player's y coordinate
        //      the game's timestamp
        //      each of the input keys (wasd, shift, and arrow keys) statuses
        //      ....

        // To aid readibility and shorten the file, the keys pressed will be
        // truncated to a string of characters representing them. UDLR refer to
        // up, down, left, and right on the arrow keys, while udlr are the equivalent
        // with the wsad set.
        keysdown = "", cursors.up.isDown && (keysdown += "U"), cursors.down.isDown && (keysdown += "D"), cursors.left.isDown && (keysdown += "L"), cursors.right.isDown && (keysdown += "R"), wasd.up.isDown && (keysdown += "u"), wasd.down.isDown && (keysdown += "d"), wasd.left.isDown && (keysdown += "l"), wasd.right.isDown && (keysdown += "r");
        hist.push({
            x: Math.round(player.x),
            y: Math.round(player.y),
            time: game.time.now,
            keys: keysdown
            /*up: cursors.up.isDown,
            down: cursors.down.isDown,
            left: cursors.left.isDown,
            right: cursors.right.isDown,
            w: wasd.up.isDown,
            s: wasd.down.isDown,
            a: wasd.left.isDown,
            d: wasd.right.isDown*/
        });

        //player movement
        var anispeed = 40;
        var movespeed = 50;
        player.body.velocity.y = 0;
        player.body.velocity.x = 0;
        player.animations.stop();

        if (mstate == 1) {
            if (cursors.up.isDown || wasd.up.isDown) {
                if (cursors.up.shiftKey || wasd.up.shiftKey) {
                    movespeed = 100;
                }
                player.body.velocity.y -= movespeed;
                player.angle = 0;
                player.animations.play('rolling', anispeed, true);
                active = true;
            } else if (cursors.down.isDown || wasd.down.isDown) {
                if (cursors.down.shiftKey || wasd.down.shiftKey) {
                    movespeed = 100;
                }
                player.body.velocity.y += movespeed;
                player.angle = 180;
                player.animations.play('rolling', anispeed, true);
                active = true;
            } else if (cursors.left.isDown || wasd.left.isDown) {
                if (cursors.left.shiftKey || wasd.left.shiftKey) {
                    movespeed = 100;
                }
                player.body.velocity.x -= movespeed;
                player.angle = -90;
                player.animations.play('rolling', anispeed, true);
                active = true;
            } else if (cursors.right.isDown || wasd.right.isDown) {
                if (cursors.right.shiftKey || wasd.right.shiftKey) {
                    movespeed = 100;
                }
                player.body.velocity.x += movespeed;
                player.angle = 90;
                player.animations.play('rolling', anispeed, true);
                active = true;
            }
        } else if (mstate == 2) {
            if (boxText.bottom > box.bottom) {
                scrollDown.visible = true;
            } else {
                scrollDown.visible = false;
            }
            if (boxText.top < box.top) {
                scrollUp.visible = true;
            } else {
                scrollUp.visible = false;
            }
            if (cursors.down.isDown || wasd.down.isDown) {
                if (boxText.bottom > box.bottom) {
                    boxText.y -= 1; //let it be jumpy for the moment, we'll smooth it out later
                    active = true;
                }
            } else if (cursors.up.isDown || wasd.up.isDown) {
                if (boxText.top < box.top) {
                    boxText.y += 1;
                    active = true;
                }
            }
        } else if (mstate == 3) {
            if (game.input.activePointer.isDown) {
                console.log("Here's where we'll end it, somehow.");
            }
        }


        // Set up collision and overlap functions
        game.physics.arcade.collide(player, blockedLayer, this.hitwall, null); //collide with anything on the blocked layer, no matter what it is.

        //knock out the dark tiles when the player's aura collides with them
        game.physics.arcade.collide(see, darkLayer, this.lightup, null);

        // button functionality
        game.physics.arcade.overlap(player, rBs, this.redWall, null);
        game.physics.arcade.overlap(player, button, this.endButton, null);
    },

    // ******* Supporting Functions ********

    /*
     * This function comes from a tutorial, but the Phaser documentation hints at needing
     * to do this one way or another, so we'll keep it.
     * 
     * Basically, this function is passed a tag for the 'type' property that
     * is added to objects in Tiled to identify them as one kind or another (item, door, etc.)
     * along with the map object, and the name of layer to look in. It returns an array
     * of all the objects it finds that match.
     */
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // Phaser uses top left, Tiled bottom left, so adjustments are made here...
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    /*
     * This also comes from the tutorial, and may be replaced with Phaser's built-in
     * Tilemap.createFromObjects later once I figure out what the difference is...
     */
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        //copy properties to the sprite
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },

    //place an animated wall opening at tile coordinates given
    createWallTile: function(littleX, littleY) {
        map.removeTile(littleX, littleY, 1);
        var wall = walls.create(littleX * 32, littleY * 32, 'openable');
        wall.animations.add('opening');
        wall.body.immovable = true;
        return wall;
    },

    // Send stored data to the output file and clear the array for more
    logData: function() {
        if (logging) {
            this.saveToFile(hist);
            hist = [];
        }
    },

    // Check whether the player has been inactive
    checkActive: function() {
        if (!active) {
            logging = false;
            window.location.assign("inactive.html")
        } else {
            active = false;
        }
    },

    //Save to a file.
    saveToFile: function(data) {
        jsonString = JSON.stringify(data);
        $.ajax({
            url: 'save.php',
            data: { 'jsonString': jsonString, 'fname': fname },
            type: 'POST'
        });
    },

    // get rid of the dark tiles by making them transparent
    lightup: function(see, darktile) {
        darktile.alpha = 0;
        map.layers[3].dirty = true;
    },

    //when a player hits a red button, flip the button so it's pressed down,
    //check whether the coordinates associated with this button have the right
    //wall tile, and if so, make a new wall-opening sprite in its place, animate it,
    //and update the floor tile too.
    redWall: function(player, button) {
        button.frame = 1;
        //button.LED.index = 85;
        if (button.alpha > 0.2) {
            pressedSum += 1;
            clickSound.play();
        }
        button.alpha = 0.2;
        if (map.hasTile(button.opensX, button.opensY, 1)) {
            if (map.getTile(button.opensX, button.opensY, 1).index == 32) {
                var wall = playState.createWallTile(button.opensX, button.opensY);
                playState.wallopen(player, wall);
                map.layers[0].dirty = true;
            }
        }
    },

    //Use this button to end the game...we'll add an "are you sure" dialog
    //once dialog boxes are sorted out.
    endButton: function(player, button) {
        button.frame = 1;
        game.camera.shake(0.1, 500);
        player.x = 79;
        player.y = 83;
        playState.gameOver();
    },

    wallopen: function(player, wall) {
        //get the tile location of the wall (before we destroy it)
        var temp = map.getTileWorldXY(wall.x, wall.y, 32, 32, 0);
        // more importantly, get the tile right below it (and on the background layer)
        // so we can replace it with the unshadowed version
        var temp2 = map.getTileBelow(0, temp.x, temp.y);
        if (temp2.index == 77) {
            temp2.index = 74;
        } else if (temp2.index == 78) {
            temp2.index = 76;
        }
        //animate the wall opening up
        wall.animations.play('opening', 4, false, true); // play the animation at 4 fps, don't loop, and destroy the sprite at the end
        console.log('opening the wall');

        //boost the progress bar
        pbar.frame += 1;
    },

    //report when the player runs into a wall (for debugging purposes)
    //and allow for teleportation from certain walls
    hitwall: function(player, wallpart) {
        console.log('Ran into wall at X:' + wallpart.x + ' Y:' + wallpart.y);
        if (wallpart.x == 15 && wallpart.y == 16) {
            game.camera.shake(0.1, 100);
            player.x = 626.5;
            player.y = 490.5;
        }
        if (wallpart.x == 15 && wallpart.y == 19) {
            game.camera.shake(0.1, 100);
            player.x = 622.5;
            player.y = 40;
        }
    },

    // Not being used at the moment, but hopefully soon. This should produce
    // a dialog box at some specific location, with whatever text is desired.
    // It does create the box right now, but not the text.
    openDialog: function(x, y, text) {
        //if x and y aren't provided, 416 and 255 are used as defaults
        void 0 === x && (x = 416), void 0 === y && (y = 255);
        db = game.add.image(x, y, 'db');
        db.anchor.setTo(0.5, 0.5);
        db.scale.setTo(0, 0);
        jv = game.add.tween(db.scale).to({ x: 1, y: 1 }, 500, "Linear", true, 0, 0, false);
        jv.start();
    },

    showInstructions: function() {
        // To be added:
        // -- specify the condition of the game in order to change the dialog here
        box = game.add.image(310, 287, 'InstBack');
        box.anchor.setTo(0.5, 0.5);
        box.scale.setTo(0, 0);
        bxup = game.add.tween(box.scale).to({ x: 1, y: 1 }, 500, "Linear", false, 0, 0, false);
        bxup.onComplete.add(function() {
            //The dialog box is open, now to make it into a mask
            boxmask = game.add.graphics(230, 239);
            boxmask.beginFill(0xffffff);
            boxmask.drawRect(0, 0, 160, 96);
            //load the text for the box
            boxText = game.add.image(230, 239, 'InstFront');
            boxText.mask = boxmask;
            mstate = 2;
            scrollDown = game.add.sprite(370, 314, 'scroll');
            scrollDown.scale.setTo(0.5, 0.5);
            scrollDown.animations.add('scrl');
            scrollDown.animations.play('scrl', 2, true, false);
            scrollDown.inputEnabled = true;
            scrollDown.events.onInputDown.add(
                function() {
                    if (boxText.bottom > box.bottom) {
                        boxText.y -= 1; //let it be jumpy for the moment, we'll smooth it out later
                    }
                }, this)
            scrollUp = game.add.sprite(385, 258, 'scroll');
            scrollUp.scale.setTo(0.5, 0.5);
            scrollUp.angle = 180;
            scrollUp.animations.add('scrl');
            scrollUp.animations.play('scrl', 2, true, false);
            scrollUp.inputEnabled = true;
            scrollUp.events.onInputDown.add(function() {
                if (boxText.top < box.top) {
                    boxText.y += 1; //let it be jumpy for the moment, we'll smooth it out later
                }
            }, this)
            closeButton = game.add.image(381, 240, 'close');
            closeButton.scale.setTo(0.5, 0.5);
            closeButton.inputEnabled = true;
            closeButton.events.onInputDown.add(
                playState.closeInst);
        }, this);
        bxup.start();
    },

    closeInst: function() {
        // Close the instructions box
        boxText.destroy();
        bxdown = game.add.tween(box.scale).to({ x: 0, y: 0 }, 500, "Linear", true, 0, 0, false);
        boxmask.destroy();
        scrollUp.destroy();
        scrollDown.destroy();
        closeButton.destroy();
        mstate = 1;
        if (endGame) {
            window.location.assign("after.html")
        }
    },

    // gameOver: function() {
    //     // Using the same box from the intstructions, but with
    //     // different text depending on the game condition.
    //     box = game.add.image(80, 111, 'InstBack');
    //     box.anchor.setTo(0.5, 0.5);
    //     box.scale.setTo(0, 0);
    //     bxup = game.add.tween(box.scale).to({ x: 1, y: 1 }, 500, "Linear", false, 0, 0, false);
    //     bxup.onComplete.add(function() {
    //         if (clearGoalreaching) {
    //             boxText = game.add.image(box.left, box.top, 'over2');
    //         } else {
    //             boxText = game.add.image(box.left, box.top, 'over1');
    //         }
    //         mstate = 3;
    //     }, this);
    //     bxup.start();
    //     //stop logging
    //     endGame = true;
    // },

    gameOver: function() {
        game.state.start('gameoverState');
    },

    jumpUp: function() {
        game.camera.shake(0.1, 100);
        player.x = 625;
        player.y = 19;
    }
};