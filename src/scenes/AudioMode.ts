import Phaser from 'phaser';

interface GameConfig {
  sound_idx: number;
  n_sound: any;
  trail: number;
  nback: number;
  interval: number;
  sound_type: string;
}

function getRandomInt(min: number, max: number) {
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}

function sampleArray(arr: Phaser.Sound.BaseSound[], size: number) {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

async function nback_game(
  audio: AudioMode,
  nback: number,
  interval: number,
  n_trail: number,
  n_sound: number,
  sound_type: string
) {
  let all_sounds: Phaser.Sound.BaseSound[] = [];
  console.log(sound_type);

  switch (sound_type) {
    case 'number':
      for (const ele of ['1', '2', '3', '4', '5', '6', '7', '8']) {
        all_sounds.push(audio.sound.add(ele));
      }
      break;

    default:
      for (const ele of ['h', 'j', 'k', 'l', 'q', 'r', 's', 't']) {
        all_sounds.push(audio.sound.add(ele));
      }
      break;
  }
  all_sounds = sampleArray(all_sounds, n_sound);

  const correct = audio.sound.add('correct');
  const wrong = audio.sound.add('wrong');

  let break_loop = false;

  const stopBtn = audio.add
    .text(200, 70, 'Stop', { font: '40px' })
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
  audio.scene.start('Menu');
}

export default class AudioMode extends Phaser.Scene {
  trail: number;
  nback: number;
  interval: number;
  n_sound: number;
  score: number;
  sound_type!: string;
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
    this.sound_type = data.sound_type;
  }

  preload() {
    switch (this.sound_type) {
      case 'number':
        for (const ele of ['1', '2', '3', '4', '5', '6', '7', '8']) {
          this.load.audio(ele, `assets/sounds/number/${ele}.mp3`);
        }
        break;
      default:
        for (const ele of ['h', 'j', 'k', 'l', 'q', 'r', 's', 't']) {
          this.load.audio(ele, `assets/sounds/alpha/${ele}.mp3`);
        }
        break;
    }
    this.load.audio('correct', 'assets/sounds/feedback/rightanswer.mp3');
    this.load.audio('wrong', 'assets/sounds/feedback/wronganswer.mp3');
  }

  create() {
    nback_game(
      this,
      this.nback,
      this.interval,
      this.trail,
      this.n_sound,
      this.sound_type
    );
  }
}
