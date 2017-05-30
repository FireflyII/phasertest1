var SpaceH = SpaceH || {}; //I still don't get what this is for.

//title screen
SpaceH.Game = function(){};

SpaceH.Game.prototype = {
	create: function() {
		//set world dimensions
		this.game.world.setBounds(0, 0, 1920, 1920);
		//Hmmm...how does this affect what was done in Boot? There, no world bounds were set, but
		//it did enable "scaling" for the screen...

		this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

		//create player
		this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
		//Again, why use game.world in some cases, and not others? Does writing "this.<anything>" automatically
		//establish that variable, without needing to declare it first?

		this.player.scale.setTo(2);

		this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
		this.player.animations.play('fly');
		//The tutorial says that means it'll be animated continuously...

		//set the camera to follow the player...
		this.game.camera.follow(this.player);
		//##### The order apparently matters here. If collectibles comes first, asteroids will be on top of them.
		this.generateCollectables;
		//this.generateAsteroids();

		this.playerScore = 0;

		//enable player physics
		this.game.physics.arcade.enable(this.player);
		this.playerSpeed = 120; //In what direction?
		this.player.body.collideWorldBounds = true;

		this.explosionSound = this.game.add.audio('explosion');
		this.collectSound = this.game.add.audio('collect');
		this.showLabels();
	},
	update: function() {
		if(this.game.input.activePointer.justPressed()) {
			//move in the direction of the input
			this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
		}
		//collision between player and asteroids
		this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
		//I'm really losing track of 'this'... why does it need to be called so much?

		//overlap (not collision) between player and collectables
		this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
	},
	showLabels: function() {
		var text = "0";
		var style = {font: "20px Arial", fill: "#fff", align: "center"};
		this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height-50, text, style);
		this.scoreLabel.fixedToCamera = true;
	},
	collect: function(player, collectable) {
		this.collectSound.play();
		this.playerScore++;
		collectable.kill();
		this.scoreLabel.text = this.playerScore;
	},
	generateAsteroids: function() {
		this.asteroids = this.game.add.group();

		//enable physics
		this.asteroids.enableBody = true;
		this.asteroids.physicsBodyType = Phaser.Physics.ARCADE; //Does this suggest that we could have more than
		//one kind of physics in use at once?

		//phaser's random number generator
		var numAsteroids = this.game.rnd.integerInRange(150, 200); //Why use this over another random number generator?
		var asteroid;
		for (var i=0; i < numAsteroids; i++){
			//add sprite
			asteroid = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
			asteroid.scale.setTo(this.game.rnd.integerInRange(10,40)/10);
			//physics properties
			asteroid.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
			asteroid.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
			asteroid.body.immovable = false; //OKAY, EXPLAIN THIS, PLEASE. IT HAS A VELOCITY, BUT IT CAN'T MOVE?
			asteroid.body.collideWorldBounds = true;
		}
	},
	hitAsteroid: function(player, asteroid) {
		//This is the first function to have arguments passed to it!

		this.explosionSound.play();
		//make the player explode
		var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
		emitter.makeParticles('playerParticle');
		emitter.minParticleSpeed.setTo(-200, -200);
		emitter.maxParticleSpeed.setTo(200, 200);
		emitter.gravity = 0; // Also, the first mention of gravity in this game.
		emitter.start(true, 1000, null, 100);
		this.player.kill();
		//call gameOver method in 800 milliseconds
		this.game.time.events.add(800, this.gameOver, this);
		//game.time.events?
	},
	/*
	generateCollectables: function() {
		this.collectables = this.game.add.group();
		this.collectables.enableBody = true;
		this.collectables.physicsBodyType = Phaser.Physics.ARCADE;
		var numCollectables = this.game.rnd.integerInRange(100, 150);
		var collectable;
		for (var i=0; i < numCollectables; i++){
			collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
			collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
			collectable.animations.play('fly');
		}
	}*/
	generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  }

};