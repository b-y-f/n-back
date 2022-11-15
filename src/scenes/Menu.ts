import Phaser from 'phaser';
let stats: Phaser.GameObjects.Text;
let addNSample: Phaser.GameObjects.Text;
let minNSample: Phaser.GameObjects.Text;
let numOfSampleText: Phaser.GameObjects.Text;

export default class Menu extends Phaser.Scene {
  gameSettings: {
    trail: number;
    nback: number;
    interval: number;
    n_sound: number;
  };
  constructor() {
    super('Menu');
    this.gameSettings = {
      trail: 60,
      nback: 3,
      interval: 3,
      n_sound: 5
    };
  }

  preload() {}

  create() {
    const startBtn = this.add
      .text(150, 70, 'Start', { font: '40px' })
      .setInteractive();
    startBtn.on('pointerdown', () => {
      this.scene.start('Audio mode', {
        ...this.gameSettings
      });
    });

    stats = this.add.text(10, 10, '', { color: '#00ff00' });

    this.add.text(50, 170, 'Trails', { font: '30px' });

    const t_30 = this.add
      .text(200, 170, '30', {
        font: '30px'
      })
      .setInteractive();
    const t_60 = this.add
      .text(300, 170, '60', {
        font: '30px'
      })
      .setInteractive();
    const t_90 = this.add
      .text(400, 170, '90', {
        font: '30px'
      })
      .setInteractive();
    t_30.on('pointerdown', () => {
      this.gameSettings.trail = 30;
    });
    t_60.on('pointerdown', () => {
      this.gameSettings.trail = 60;
    });
    t_90.on('pointerdown', () => {
      this.gameSettings.trail = 90;
    });

    this.add.text(50, 270, 'Sample', { font: '30px' });

    addNSample = this.add
      .text(250, 270, 'up', { font: '30px' })
      .setInteractive();
    addNSample.on('pointerdown', () => {
      this.gameSettings.n_sound++;
    });
    minNSample = this.add
      .text(350, 270, 'down', { font: '30px' })
      .setInteractive();
    minNSample.on('pointerdown', () => {
      this.gameSettings.n_sound--;
    });
  }

  update() {
    stats.setText([
      'trail: ' + this.gameSettings.trail,
      'nback: ' + this.gameSettings.nback,
      'nsound: ' + this.gameSettings.n_sound
    ]);
  }
}
