import Phaser from 'phaser';
import { ConfusionMatrix, GameConfig } from './types';

let scorePanel: Phaser.GameObjects.Text;

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

function calcCorrectRate(game: AudioMode) {
  if (game.score.TP + game.score.FN == 0) {
    return;
  }
  game.score.correct = (
    game.score.TP /
    (game.score.TP + game.score.FP + game.score.FN)
  ).toFixed(2);
}

async function nback_game(game: AudioMode) {
  // let trails;
  let all_sounds: Phaser.Sound.BaseSound[] = [];
  let stopBtnClicked: boolean = false;
  function resetGame() {
    game.score = {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
      correct: ''
    };
    all_sounds = [];
  }

  switch (game.sound_type) {
    case 'number':
      for (const ele of ['1', '2', '3', '4', '5', '6', '7', '8']) {
        all_sounds.push(game.sound.add(ele));
      }
      break;
    case 'piano':
      for (const ele of ['A4', 'B4', 'C4', 'C5', 'D4', 'E4', 'F4', 'G4']) {
        all_sounds.push(game.sound.add(ele));
      }
      break;
    case 'shapes':
      for (const ele of [
        'circle',
        'hexagon',
        'line',
        'pentagon',
        'point',
        'rectangle',
        'square',
        'triangle'
      ]) {
        all_sounds.push(game.sound.add(ele));
      }
      break;

    default:
      for (const ele of ['h', 'j', 'k', 'l', 'q', 'r', 's', 't']) {
        all_sounds.push(game.sound.add(ele));
      }
      break;
  }
  all_sounds = sampleArray(all_sounds, game.n_sound);
  const trails = Array.from({ length: game.trail }, () =>
    getRandomInt(0, game.n_sound)
  );

  const correct = game.sound.add('correct');
  const wrong = game.sound.add('wrong');

  const stopBtn = game.add
    .text(200, 750, 'STOP GAME', { font: '20px' })
    .setInteractive();
  stopBtn.on('pointerdown', () => {
    stopBtnClicked = true;
    resetGame();
    game.scene.start('Menu');
  });

  let actual_correct = false;
  let clicked: boolean;
  game.input.on('pointerdown', () => {
    if (stopBtnClicked) {
      return;
    }
    if (!clicked) {
      clicked = true;
      if (actual_correct) {
        correct.play();
        game.score.TP++;
        calcCorrectRate(game);
      } else {
        wrong.play();
        game.score.FP++;
        calcCorrectRate(game);
      }
    }
  });

  for (const [idx, ele] of trails.entries()) {
    clicked = false; // every round have only one chance to click
    if (stopBtnClicked) {
      break;
    }
    all_sounds[ele].play();
    actual_correct = trails[idx - game.nback] == ele;

    await sleep(game.interval);

    if (!clicked) {
      if (actual_correct) {
        game.score.FN++;
        calcCorrectRate(game);
      } else {
        game.score.TN++;
        calcCorrectRate(game);
      }
    }
  }
}

export default class AudioMode extends Phaser.Scene {
  trail!: number;
  nback!: number;
  interval!: number;
  n_sound!: number;
  sound_type!: string;
  score: ConfusionMatrix;
  constructor() {
    super('Audio mode');
    this.score = {
      TP: 0,
      TN: 0,
      FP: 0,
      FN: 0,
      correct: ''
    };
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
      case 'piano':
        for (const ele of ['A4', 'B4', 'C4', 'C5', 'D4', 'E4', 'F4', 'G4']) {
          this.load.audio(ele, `assets/sounds/piano/${ele}.wav`);
        }
        break;
      case 'shapes':
        for (const ele of [
          'circle',
          'hexagon',
          'line',
          'pentagon',
          'point',
          'rectangle',
          'square',
          'triangle'
        ]) {
          this.load.audio(ele, `assets/sounds/shapes/${ele}.mp3`);
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
    scorePanel = this.add.text(10, 10, '', { color: '#00ff00' });
    nback_game(this);
  }

  update(): void {
    scorePanel.setText([
      'TP:' + this.score.TP,
      'TN:' + this.score.TN,
      'FP:' + this.score.FP,
      'FN:' + this.score.FN,
      'Correct:' + this.score.correct
    ]);
  }
}
