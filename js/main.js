var SpaceH = SpaceH || {};

SpaceH.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

SpaceH.game.state.add('Boot', SpaceH.Boot);
console.log('testing');
SpaceH.game.state.add('Preload', SpaceH.Preload);
SpaceH.game.state.add('MainMenu', SpaceH.MainMenu);
SpaceH.game.state.add('Game', SpaceH.Game);

SpaceH.game.state.start('Boot');