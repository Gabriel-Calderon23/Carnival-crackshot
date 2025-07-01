// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/


export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("fondo", "./public/assets/inicio.png");
    this.load.image("marco", "./public/assets/marco.png");
    this.load.image("carril", "./public/assets/carril.png");
    this.load.image("cortina", "./public/assets/cortina.png");
    this.load.image("tiket", "./public/assets/tiket.png");
    this.load.image("escopeta", "./public/assets/escopeta.png");
    this.load.image("cartucho", "./public/assets/cartucho.png");
    this.load.image("puntero", "./public/assets/puntero.png");
    this.load.image("pato", "./public/assets/pato.png");
  }

  create() {
    this.anchoPantalla = this.sys.game.config.width;
    this.limiteIzquierdo = -60;
    this.limiteDerecho = this.anchoPantalla + 60;

    this.add.image(0, 0, "fondo").setOrigin(0);
    this.add.image(0, 0, "marco").setOrigin(0);
    this.add.image(0, -40, "carril").setOrigin(0);
    this.add.image(0, 170, "carril").setOrigin(0);
    this.add.image(0, 340, "carril").setOrigin(0);

    // Cartuchos
    this.cartuchos = [];
    this.recargarCartuchos();

  
    this.add.image(0, 0, "tiket").setOrigin(0);
    this.add.image(0, 0, "escopeta").setOrigin(0);

    const cartuchoX = 20;
    const cartuchoY = 520;
    for (let i = 0; i < 8; i++) {
      let cartucho = this.add.image(cartuchoX + i * 40, cartuchoY, "cartucho").setOrigin(0);
      this.cartuchos.push(cartucho);
    }

    this.ronda = 1;
    this.patosAcertados = 0;
    this.puntaje = 0;

    this.patos = this.physics.add.group();

    this.textoPuntaje = this.add.text(800, 850, `Puntaje: ${this.puntaje}`, {
      fontSize: '40px',
      fill: '#ffffff'
    });

    this.textoRonda = this.add.text(800, 900, `Ronda: ${this.ronda}`, {
      fontSize: '40px',
      fill: '#ffffff'
    });

    this.iniciarRonda();

    this.puntero = this.add.image(400, 300, "puntero").setOrigin(0.5);
    this.puntero.setDepth(1000);
    this.input.setDefaultCursor('none');

    this.input.on("pointerdown", this.disparar, this);
  }

  recargarCartuchos() {
    if (this.cartuchos.length) {
      this.cartuchos.forEach(c => c.destroy());
      this.cartuchos = [];
    }

    const cartuchoX = 20;
    const cartuchoY = 0;
    for (let i = 0; i < 8; i++) {
      let cartucho = this.add.image(cartuchoX + i * 40, cartuchoY, "cartucho").setOrigin(0);
      this.cartuchos.push(cartucho);
    }
  }

  iniciarRonda() {
    this.patosAcertados = 0;
    this.patos.clear(true, true);
    this.recargarCartuchos();

    this.patosCreados = 0;
    this.maxPatos = 8;
    this.carrilesY = [120, 280, 500];

    this.textoRonda.setText(`Ronda: ${this.ronda}`);

    this.timedEvent = this.time.addEvent({
      delay: 3000,
      repeat: 3,
      callback: () => {
        this.crearParejaPatos();
      }
    });

    
  }

  crearParejaPatos() {
    let indices = Phaser.Utils.Array.Shuffle([ 1, 2]);
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

      this.patosCreados++;
    }

    if (this.patosCreados >= this.maxPatos) {
      this.time.delayedCall(6000, () => this.terminarRonda(), [], this); // Espera 6 segundos en vez de 12
    }


    this.add.image(0, 0, "cortina").setOrigin(0);



  }

  disparar(pointer) {
    if (this.cartuchos.length === 0) return;

    let cartucho = this.cartuchos.pop();
    cartucho.destroy();

    this.patos.children.iterate((pato) => {
      if (!pato.getData('vivo')) return;
      let bounds = pato.getBounds();
      if (
        pointer.worldX >= bounds.x &&
        pointer.worldX <= bounds.x + bounds.width &&
        pointer.worldY >= bounds.y &&
        pointer.worldY <= bounds.y + bounds.height
      ) {
        pato.setData('vivo', false);
        pato.destroy();
        this.patosAcertados++;
        this.puntaje += 500;
        this.textoPuntaje.setText(`Puntaje: ${this.puntaje}`);
        return false;
      }
    });
  }

  terminarRonda() {
    if (this.patosAcertados >= 6) {
      this.ronda++;
      this.iniciarRonda();
    } else {
      this.scene.start('gameover', { puntaje: this.puntaje }); // Usa el puntaje real
    }
  }

  update() {
    const pointer = this.input.activePointer;
    this.puntero.x = pointer.worldX;
    this.puntero.y = pointer.worldY;

    if (!this.patos) return;

    this.patos.children.iterate((pato) => {
      if (!pato.getData('vivo')) return;

      let direccion = pato.getData('direccion');
      pato.x += direccion * 5; 

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