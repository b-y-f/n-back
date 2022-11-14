import Phaser from 'phaser';
import config from './config';
import Menu from './scenes/Menu';
import AudioMode from './scenes/AudioMode';

new Phaser.Game(
  Object.assign(config, {
    scene: [Menu, AudioMode]
  })
);
