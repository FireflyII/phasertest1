//boot
InText1 = "Instructions:\n\nUse the arrow keys to explore the environment and look for special red buttons to press. Each button will advance your progress, and make a change to the game world somewhere, allowing you to explore different areas. When you have found and pressed all the buttons, return to this room and drive onto the large blue button to finish the game and see how you did!";
InText2 = "Welcome!\nIn this experiment you will be given control of a small robot to operate in an unknown environment. Within this area there are a number of red buttons, which you can press by driving onto them. Each button will make a change somewhere in the game world, and advance your progess. Your task is to find and press all of these buttons as quickly as you can, and then return to your starting position to press the large blue button to complete the game. When you have finish, you will be told how many of the buttons you found, and given a few questions to answer. Thank you in advance for your participation! When you're ready, press the spacebar or click the screen for further information."
InText3 = "Instructions:\n\nUse the arrow keys or WASD to move around and explore the world. Holding the 'shift' key will allow you move faster. Some of the map will change in response to your progression, so you may want to revisit areas you have already seen in case you find new paths open to you.\n\nClick or press space again to see the previous screen."
var bootState = {

    create: function() {

        // Here we display the name of the game. When defining text, the
        // first two parameters are x and y positional values, then the
        // actual text, and then the 'font' defines the font (of course)
        // and 'fill' refers to the font color.
        nameLabel = game.add.text(80, 80, InText2, { font: '24px Arial', fill: '#ffffff' });
        nameLabel.wordWrap = true;
        nameLabel.wordWrapWidth = game.width - 100;

        // We give the player instructions on how to start the game
        startLabel = game.add.text(80, game.world.height - 80,
            'press the "W" key to start', { font: '25px Arial', fill: '#ffffff' });
        startLabel.visible = false;
        // We define the wkey as Phaser.Keyboard.W so that we can act
        // when the player presses it
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        var skey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // When the player presses the W key, we call the start function
        wkey.onDown.addOnce(this.start, this);
        skey.onDown.addOnce(this.next, this);
        game.input.onDown.addOnce(this.next, this);
    },

    next: function() {
        if (nameLabel.text != InText3) {
            nameLabel.text = InText3;
            startLabel.visible = true;
        } else {
            nameLabel.text = InText2;
            startLabel.visible = false;
        }

    },
    // The start function calls the play state    
    start: function() {
        game.state.start('play');
    },
};