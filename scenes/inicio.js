export default class Inicio extends Phaser.Scene {
  constructor() {
    super('inicio');
  }

  preload() {
    this.load.image("fondo", "./public/assets/inicio.png");
    this.load.image("titulo", "./public/assets/nombre.png");
    this.load.image("boton", "./public/assets/boton.png");
  }

  create() {
    this.add.image(0, 0, "fondo").setOrigin(0);
    this.add.image(0, 0, "titulo").setOrigin(0);

    // Botón para comenzar el juego (centrado y con interacción)
    const boton = this.add.image(0, 0, "boton").setOrigin(0).setInteractive();

    boton.on('pointerdown', () => {
      this.scene.start('hello-world');
    });

    // Texto que indica cómo iniciar
    this.add.text(
      720, 730,
      'Presiona el botón para jugar',
      {
        fontSize: '32px',
        fill: '#fff'
      }
    ).setOrigin(0.5);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.restart();
    });
  }
}