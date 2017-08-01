//Intro

//Clear Possibilities & Clear Goal-Reaching
cPcG = "Welcome!\nIn this experiment you will be given control of a small robot to operate in an unfamiliar environment. Use the arrow keys, or WASD to move around and explore. Holding the 'shift' key will allow you to move faster. Distributed within this area there are eight red buttons, which you can press by driving onto them. Each button will make a change somewhere in the game world, and advance your progess. Your task is to find and press all of these buttons as quickly as you can, and then return to your starting position to press the large blue button to complete the game. When you have finish, you will be told how many of the buttons you found, and given a few questions to answer. Thank you in advance for your participation!";
//Clear Possibilities & Unclear Goal-Reaching
cPuG = "Welcome!\nIn this experiment you will be given control of a small robot to operate in an unknown environment. Use the arrow keys, or WASD to move around and explore. Holding the 'shift' key will allow you to move faster. Within this area there are a number of red buttons, which you can press by driving onto them. Each button will make a change somewhere in the game world, and advance your progess. Your task is to find and press all of these buttons as quickly as you can, and then return to your starting position to press the large blue button to complete the game. You will not be told how many buttons there are, or whether you found them all, so try to be sure you have found as many as you can before pressing the blue button. When you have finish, you will be given a few questions to answer. Thank you in advance for your participation!";
//Unclear Possibilities & Clear Goal-Reaching
uPcG = "Welcome!\nIn this experiment you will be given control of a small robot to operate in an unfamiliar environment. Distributed within this area there are eight red buttons, which you can press by driving onto them. Your task is to find and press all of these buttons as quickly as you can, and then return to your starting position to press the large blue button to complete the game. When you have finish, you will be told how many of the buttons you found, and given a few questions to answer. Thank you in advance for your participation!";
//Unclear Possibilites & Unclear Goal-Reaching
uPuG = "Welcome!\nIn this experiment you will be given control of a small robot to operate in an unfamiliar environment. Distributed within this area there are eight red buttons, which you can press by driving onto them. Your task is to find and press all of these buttons as quickly as you can, and then return to your starting position to press the large blue button to complete the game. You will not be told how many buttons there are, or whether you found them all, so try to be sure you have found as many as you can before pressing the blue button. When you have finish, you will be given a few questions to answer. Thank you in advance for your participation!";
/*if (clearPossibilities && clearGoalreaching) {
    inText = cPcG;
} else if (clearPossibilities && !clearGoalreaching) {
    inText = cPuG;
} else if (!clearPossibilities && clearGoalreaching) {
    inText = uPcG;
} else {
    inText = uPuG;
}*/
inText = clearPossibilities && clearGoalreaching ? cPcG : clearPossibilities && !clearGoalreaching ? cPuG : !clearPossibilities && clearGoalreaching ? uPcG : uPuG;
var bootState = {

    create: function() {

        // Here we display the name of the game. When defining text, the
        // first two parameters are x and y positional values, then the
        // actual text, and then the 'font' defines the font (of course)
        // and 'fill' refers to the font color.
        nameLabel = game.add.text(80, 80, inText, { font: '20px Arial', fill: '#ffffff' });
        nameLabel.wordWrap = true;
        nameLabel.wordWrapWidth = game.width - 100;

        // We give the player instructions on how to start the game
        startLabel = game.add.text(80, game.world.height - 80,
            'Press the "W" key to start', { font: '22px Arial', fill: '#ffffff' });
        //startLabel.visible = false;
        // We define the wkey as Phaser.Keyboard.W so that we can act
        // when the player presses it
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        //var skey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // When the player presses the W key, we call the start function
        wkey.onDown.addOnce(this.start, this);
        //skey.onDown.addOnce(this.next, this);
        //game.input.onDown.addOnce(this.next, this);
    },

    // next: function() {
    //     if (nameLabel.text != InText3) {
    //         nameLabel.text = InText3;
    //         startLabel.visible = true;
    //     } else {
    //         nameLabel.text = InText2;
    //         startLabel.visible = false;
    //     }

    //},
    // The start function calls the play state    
    start: function() {
        game.state.start('play');
    }
};