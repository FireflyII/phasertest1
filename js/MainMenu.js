SpaceH.MainMenu = function() {};

SpaceH.MainMenu.prototype = {
	create: function() {
		//show repeated space tile
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

		//give it speed in x
		this.background.autoScroll(-20, 0);
		//Can anything be given a background? Is it a property of the background to be able to scroll?

		//start game text
		var text = "Click to begin";
		var style = {font: "30px Arial", fill: "#fff", align: "center"}; //What is the alignment here for?
		//Are we aligning to the middle of a page? The canvas? The textbox?
		var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style); //why are we dividing
		//the game in half to get the center? Why not use this.game.world.centerX like the preload does? Why
		//does one use 'world' and the other doesn't?
		t.anchor.set(0.5); //I don't know what this does either...

		//high score
		text = "High score: "+this.highScore; //where is this highScore variable declared? I don't see it anywhere...
		style = {font: "15px Arial", fill: "#fff", align: "center"};

		var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
		h.anchor.set(0.5);
	},
	update: function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('Game');
		}
	}
};

/*
	Questions:
	The phaser game has a number of states...booting, loading assets, creating/setting up the game world,
	and looping through while playing. Do each of these states *also* have those states within them? If so,
	what's the point, and how many iterations does this go through? If not, why am I seeing things like "create" and "update"
	within these states?

	Why do Boot and Preload need to establish the SpaceH variable, but MainMenu doesn't?

	Why are these taking the form of objects (as far as I can tell), and how is that even working? If I'm
	misunderstanding the syntax, then why is there a different syntax here than in the other demo?
*/