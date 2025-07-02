import Inicio from "./scenes/inicio.js";
import HelloWorldScene from "./scenes/game.js";
import gameover from "./scenes/gameover.js";
import musica from "./scenes/musica.js";

// Configuración del juego
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
    roundPixels: true,
  },
  scene: [musica, Inicio, HelloWorldScene, gameover], // 👈 Todas las escenas
};

// Crear instancia del juego
window.game = new Phaser.Game(config);

// Iniciar escena de música (paralela)
window.game.scene.start("musica");

// Iniciar escena de inicio del juego
window.game.scene.start("inicio");