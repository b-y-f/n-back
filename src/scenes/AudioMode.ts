import Phaser from 'phaser';

interface GameConfig {
  n_sound: any;
  trail: number;
  nback: number;
  interval: number;
}

function getRandomInt(min: number, max: number) {
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

async function nback_game(
  audio: AudioMode,
  nback: number,
  interval: number,
  n_trail: number,
  n_sound: number
) {
  const h = audio.sound.add('h');
  const j = audio.sound.add('j');
  const k = audio.sound.add('k');
  const l = audio.sound.add('l');
  const q = audio.sound.add('q');
  const r = audio.sound.add('r');
  const s = audio.sound.add('s');
  const t = audio.sound.add('t');
  const correct = audio.sound.add('correct');
  const wrong = audio.sound.add('wrong');

  let break_loop = false;

  const all_sounds = [h, j, k, l, q, r, s, t].slice(0, n_sound);

  const stopBtn = audio.add
    .text(320, 70, 'Stop', { font: '40px' })
    .setInteractive();
  stopBtn.on('pointerdown', () => {
    break_loop = true;
    audio.scene.start('Menu');
  });

  const trails = Array.from({ length: n_trail }, () =>
    getRandomInt(0, n_sound)
  );

  let correct_cond = false;
  audio.input.on('pointerdown', () => {
    if (correct_cond) {
      // console.log('good');
      correct.play();
    } else {
      // console.log('bad');
      wrong.play();
    }
  });

  for (const [idx, ele] of trails.entries()) {
    if (break_loop) {
      break;
    }
    all_sounds[ele].play();
    correct_cond = trails[idx - nback] == ele;
    await sleep(interval);
  }
  audio.add.text(500, 600, String(audio.score), { font: '40px' });

}

export default class AudioMode extends Phaser.Scene {
  trail: number;
  nback: number;
  interval: number;
  n_sound: number;
  score: number;
  constructor() {
    super('Audio mode');
    this.trail = 0;
    this.nback = 0;
    this.interval = 0;
    this.n_sound = 0;
    this.score = 0;
  }

  init(data: GameConfig) {
    this.trail = data.trail;
    this.nback = data.nback;
    this.interval = data.interval;
    this.n_sound = data.n_sound;
  }

  preload() {
    this.load.audio('h', 'assets/sounds/alpha/h.mp3');
    this.load.audio('j', 'assets/sounds/alpha/j.mp3');
    this.load.audio('k', 'assets/sounds/alpha/k.mp3');
    this.load.audio('l', 'assets/sounds/alpha/l.mp3');
    this.load.audio('q', 'assets/sounds/alpha/q.mp3');
    this.load.audio('r', 'assets/sounds/alpha/r.mp3');
    this.load.audio('s', 'assets/sounds/alpha/s.mp3');
    this.load.audio('t', 'assets/sounds/alpha/t.mp3');

    this.load.audio('correct', 'assets/sounds/feedback/rightanswer.mp3');
    this.load.audio('wrong', 'assets/sounds/feedback/wronganswer.mp3');
  }

  create() {
    nback_game(this, this.nback, this.interval, this.trail, this.n_sound);
  }
}
