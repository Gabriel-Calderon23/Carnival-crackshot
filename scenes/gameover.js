export default class GameOver extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  init(data) {
    this.puntaje = data.puntaje || 0;
  }

preload() {
    this.load.image("tablero", "./public/assets/tablero.png");
    this.load.image("gameover", "./public/assets/gameover.png");
    
  }




  create() {
    this.add.image(0,0, "tablero").setOrigin(0);
    this.add.image(0, 0, "gameover").setOrigin(0);  

    // Texto de puntaje obtenido
    this.add.text(
      750, // x (ajusta según el ancho de tu juego)
      700, // y (ajusta según el alto de tu juego)
      `Puntaje: ${this.puntaje}`,
      {
        fontSize: '48px',
        fill: '#fff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Texto para reiniciar
    this.add.text(
      770, // x (ajusta según el ancho de tu juego)
      780, // y (ajusta según el alto de tu juego)
      'Presione R para reiniciar',
      {
        fontSize: '42px',
        fill: '#fff'
      }
    ).setOrigin(0.5);

    // Ir a la escena de inicio al presionar la tecla R
    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('inicio');
    });
  }
}