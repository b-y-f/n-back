import Phaser from 'phaser';

let stats: Phaser.GameObjects.Text;
let addNSample: Phaser.GameObjects.Text;
let minNSample: Phaser.GameObjects.Text;
let numOfSampleText: Phaser.GameObjects.Text;

export default class Menu extends Phaser.Scene {
  trail: number;
  nback: number;
  interval: number;
  n_sound: number;
  constructor() {
    super('Menu');
    this.trail = 60;
    this.nback = 3;
    this.interval = 3;
    this.n_sound = 5;
  }

  preload() {}

  create() {
    const startBtn = this.add
      .text(320, 70, 'Start', { font: '40px' })
      .setInteractive();
    startBtn.on('pointerdown', () => {
      this.scene.start('Audio mode', {
        trail: this.trail,
        nback: this.nback,
        interval: this.interval,
        n_sound: this.n_sound
      });
    });

    stats = this.add.text(10, 10, '', { color: '#00ff00' });

    this.add.text(100, 170, 'Trails', { font: '30px' });

    const t_30 = this.add
      .text(250, 170, '30', {
        font: '30px'
      })
      .setInteractive();
    const t_60 = this.add
      .text(350, 170, '60', {
        font: '30px'
      })
      .setInteractive();
    const t_90 = this.add
      .text(450, 170, '90', {
        font: '30px'
      })
      .setInteractive();
    t_30.on('pointerdown', () => {
      this.trail = 30;
    });
    t_60.on('pointerdown', () => {
      this.trail = 60;
    });
    t_90.on('pointerdown', () => {
      this.trail = 90;
    });

    this.add.text(100, 270, 'Number Sample', { font: '30px' });

    addNSample = this.add
      .text(380, 270, 'up', { font: '30px' })
      .setInteractive();
    addNSample.on('pointerdown', () => {
      this.n_sound++;
    });
    minNSample = this.add
      .text(500, 270, 'down', { font: '30px' })
      .setInteractive();
    minNSample.on('pointerdown', () => {
      this.n_sound--;
    });

    numOfSampleText = this.add.text(440, 270, String(this.n_sound), {
      font: '30px'
    });
  }

  update() {
    stats.setText(['trail: ' + this.trail, 'nback: ' + this.nback]);
    numOfSampleText.setText(String(this.n_sound));
  }
}
