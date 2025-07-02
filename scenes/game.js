// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/


export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("fondo", "./public/assets/inicio.png");
    this.load.image("escenario", "./public/assets/ecenario.png");
    this.load.image("carril", "./public/assets/carril.png");
    this.load.image("tiket", "./public/assets/tiket.png");
    this.load.image("escopeta", "./public/assets/escopeta.png");
    this.load.image("cartucho", "./public/assets/cartucho.png");
    this.load.image("puntero", "./public/assets/puntero.png");
    this.load.image("pato", "./public/assets/pato.png");
    this.load.audio("disparo", "./public/musica/disparo.mp3");
    this.load.audio("pato", "./public/musica/pato.mp3");
 

  }

  create() {
    this.anchoPantalla = this.sys.game.config.width;
    this.limiteIzquierdo = -60;
    this.limiteDerecho = this.anchoPantalla + 60;

    this.add.image(0, 0, "fondo").setOrigin(0);
    this.add.image(0, -40, "carril").setOrigin(0);
    this.add.image(0, 170, "carril").setOrigin(0);
    this.add.image(0, 340, "carril").setOrigin(0);

    this.add.image(0, 0, "escenario").setOrigin(0).setDepth(10);


  
    

    this.cartuchos = [];
    this.recargarCartuchos();

    this.add.image(0, 0, "tiket").setOrigin(0).setDepth(20);
    this.add.image(0, 0, "escopeta").setOrigin(0).setDepth(20);

    const cartuchoX = 0;
    const cartuchoY = 520;
    for (let i = 0; i < 10; i++) {
      let cartucho = this.add.image(cartuchoX + i * 40, cartuchoY, "cartucho").setOrigin(0);
      cartucho.setDepth(20);
      this.cartuchos.push(cartucho);
    }

    this.cartuchos.forEach(c => c.x -= 55);

    this.ronda = 1;
    this.patosAcertados = 0;
    this.puntaje = 0;

    this.patos = this.physics.add.group();

    this.textoPuntaje = this.add.text(800, 850, `Puntaje: ${this.puntaje}`, {
      fontSize: '40px',
      fill: '#ffffff'
    }).setDepth(30);

    this.textoRonda = this.add.text(800, 900, `Ronda: ${this.ronda}`, {
      fontSize: '40px',
      fill: '#ffffff'
    }).setDepth(30);

    this.puntero = this.add.image(400, 300, "puntero").setOrigin(0.5);
    this.puntero.setDepth(1000);
    this.input.setDefaultCursor('none');

    this.input.on("pointerdown", this.disparar, this);

    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('inicio');
    });

    this.patosMuertos = 0;

    this.iniciarRonda();
  }

  recargarCartuchos() {
    if (this.cartuchos.length) {
      this.cartuchos.forEach(c => c.destroy());
      this.cartuchos = [];
    }

    const cartuchoX = 20;
    const cartuchoY = 0;
    for (let i = 0; i < 10; i++) {
      let cartucho = this.add.image(cartuchoX + i * 40, cartuchoY, "cartucho").setOrigin(0);
      cartucho.setDepth(20);
      this.cartuchos.push(cartucho);
    }

    this.cartuchos.forEach(c => c.x -= 55);
  }

  iniciarRonda() {
    this.patosAcertados = 0;
    this.patosMuertos = 0;
    this.patos.clear(true, true);
    this.recargarCartuchos();

    this.maxPatos = 10;
    this.aciertosNecesarios = 8;

    this.patosCreados = 0;
    this.carrilesY = [120, 280, 500];

    this.textoRonda.setText(`Ronda: ${this.ronda}`);

  

    this.add.image(0, 0, "ecenario").setOrigin(0).setDepth(999);

    const repeticiones = Math.ceil(this.maxPatos / 2);
    this.timedEvent = this.time.addEvent({
      delay: 2000,
      repeat: repeticiones - 1,
      callback: () => {
        this.crearParejaPatos();
      }
    });
  }

  crearParejaPatos() {
    let indices = Phaser.Utils.Array.Shuffle([1, 2]);

    for (let j = 0; j < 2 && this.patosCreados < this.maxPatos; j++) {
      const lado = Phaser.Math.Between(0, 1);
      const x = lado === 0 ? this.limiteIzquierdo : this.limiteDerecho;
      const direccion = lado === 0 ? 1 : -1;
      const y = this.carrilesY[indices[j]];

      let pato = this.patos.create(x, y, "pato").setOrigin(0);
      pato.setData('direccion', direccion);
      pato.setData('rebotes', 0);
      pato.setData('vivo', true);
      pato.setSize(24, 20);
      pato.setOffset(20, 20);
      pato.body.setAllowGravity(false);
      pato.flipX = direccion === -1;

      pato.on('destroy', () => {
        this.patosMuertos++;
        if (this.patosMuertos >= this.maxPatos) {
          this.terminarRonda();
        }
      });

      this.patosCreados++;
    }
  }

  disparar(pointer) {
    if (this.cartuchos.length === 0) return;

    this.sound.play("disparo", { volume: 0.4 });// <<< sonido del disparo

    let cartucho = this.cartuchos.pop();
    cartucho.destroy();

    this.patos.children.iterate((pato) => {
      if (!pato || !pato.getData('vivo')) return;

      let bounds = pato.getBounds();
      if (
        pointer.worldX >= bounds.x &&
        pointer.worldX <= bounds.x + bounds.width &&
        pointer.worldY >= bounds.y &&
        pointer.worldY <= bounds.y + bounds.height

      ) {

        this.sound.play("pato", { volume: 0.5 });

        pato.setData('vivo', false);
        pato.destroy();
        this.patosAcertados++;
        this.puntaje += 500;
        this.textoPuntaje.setText(`Puntaje: ${this.puntaje}`);
      }
    });
  }

  terminarRonda() {
    if (this.patosAcertados >= this.aciertosNecesarios) {
      this.ronda++;
      this.iniciarRonda();
    } else {
      this.scene.start('gameover', { puntaje: this.puntaje });
    }
  }

  update() {
    const pointer = this.input.activePointer;
    this.puntero.x = pointer.worldX;
    this.puntero.y = pointer.worldY;

    if (!this.patos) return;

    this.patos.children.iterate((pato) => {
      if (!pato || !pato.getData('vivo')) return;

      let direccion = pato.getData('direccion');
      let velocidad = 5 + Math.floor((this.ronda - 1) / 2) * 0.5;
      pato.x += direccion * velocidad;

      if (pato.x < this.limiteIzquierdo) {
        pato.setData('direccion', 1);
        pato.flipX = false;
        pato.setData('rebotes', pato.getData('rebotes') + 1);
      }

      if (pato.x > this.limiteDerecho) {
        pato.setData('direccion', -1);
        pato.flipX = true;
        pato.setData('rebotes', pato.getData('rebotes') + 1);
      }

      if (pato.getData('rebotes') > 3) {
        pato.setData('vivo', false);
        pato.destroy();
      }
    });
  }
}