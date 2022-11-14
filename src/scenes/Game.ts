import Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const logo = this.add.text(350, 70, 'logo');
  }
}
