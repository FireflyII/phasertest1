//gameover.js
var gameoverState ={
	create: function(){
		window.location.assign("after.html");
	},
	update: function(){
		//Nothing here, but there need to be two state-related functions in order for Phaser
		//to consider this to be a valid state.
	}

};