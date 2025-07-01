import HelloWorldScene from "./scenes/game.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 1536,
  height: 1024,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { 0: 0 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Inicio, HelloWorldScene, gameover],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
import Inicio from "./scenes/inicio.js";
import gameover from "./scenes/gameover.js";

