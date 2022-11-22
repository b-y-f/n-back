import Phaser from 'phaser';
let stats: Phaser.GameObjects.Text;

export default class Menu extends Phaser.Scene {
  sound_list: string[];
  sound_index: number;
  gameSettings: {
    trail: number;
    nback: number;
    interval: number;
    n_sound: number;
    sound_type: string;
  };
  constructor() {
    super('Menu');
    this.sound_index = 0;
    this.sound_list = ['alpha', 'number', 'piano', 'shapes'];

    this.gameSettings = {
      trail: 60,
      nback: 3,
      interval: 3,
      n_sound: 5,
      sound_type: this.sound_list[this.sound_index]
    };
  }

  preload() {}

  create() {
    const startBtn = this.add
      .text(180, 670, 'Start', { font: '40px' })
      .setInteractive();
    startBtn.on('pointerdown', () => {
      this.scene.start('Audio mode', {
        ...this.gameSettings
      });
    });

    stats = this.add.text(10, 10, '', { color: '#00ff00' });

    this.add.text(50, 170, 'Trails', { font: '30px' });

    this.add
      .text(250, 170, '➖', {
        font: '30px'
      })
      .setInteractive()
      .on('pointerdown', () => {
        if (this.gameSettings.trail > 30) {
          this.gameSettings.trail -= 30;
        }
      });
    this.add
      .text(350, 170, '➕', {
        font: '30px'
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.gameSettings.trail += 30;
      });

    this.add.text(50, 270, 'N-back', { font: '30px' });

    this.add
      .text(350, 270, '➕', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        this.gameSettings.nback++;
      });
    this.add
      .text(250, 270, '➖', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        if (this.gameSettings.nback > 1) {
          this.gameSettings.nback--;
        }
      });

    this.add.text(50, 370, 'Sample', { font: '30px' });

    this.add
      .text(350, 370, '➕', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        this.gameSettings.n_sound++;
      });
    this.add
      .text(250, 370, '➖', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        if (this.gameSettings.n_sound > 2) {
          this.gameSettings.n_sound--;
        }
      });

    this.add
      .text(350, 470, '➕', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        this.gameSettings.interval =
          Math.round((this.gameSettings.interval + 0.1) * 1e12) / 1e12;
      });
    this.add
      .text(250, 470, '➖', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        if (this.gameSettings.interval > 1) {
          this.gameSettings.interval =
            Math.round((this.gameSettings.interval - 0.1) * 1e12) / 1e12;
        }
      });

    this.add.text(50, 470, 'Interval', { font: '25px' });

    this.add
      .text(50, 570, 'Switch Sound', { font: '30px' })
      .setInteractive()
      .on('pointerdown', () => {
        this.sound_index = (this.sound_index + 1) % this.sound_list.length;
        this.gameSettings.sound_type = this.sound_list[this.sound_index];
      });
  }

  update() {
    stats.setText([
      'trail: ' + this.gameSettings.trail,
      'nback: ' + this.gameSettings.nback,
      'nsound: ' + this.gameSettings.n_sound,
      'interval: ' + this.gameSettings.interval,
      'sound_type: ' + this.sound_list[this.sound_index]
    ]);
  }
}
