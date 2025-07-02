export default class MusicaScene extends Phaser.Scene {
  constructor() {
    super("musica");
  }

  preload() {
    this.load.audio("musicaFondo", "./public/musica/musica.mp3");
  }

  create() {
    // Reproduce solo si no está ya sonando
    if (!this.sound.get("musicaFondo")) {
      this.musica = this.sound.add("musicaFondo", {
        loop: true,
        volume: 0.3
      });
      this.musica.play();
    }
  }
}