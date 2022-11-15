export interface ConfusionMatrix {
  TP: number;
  TN: number;
  FP: number;
  FN: number;
}

export interface GameConfig {
  sound_idx: number;
  n_sound: number;
  trail: number;
  nback: number;
  interval: number;
  sound_type: string;
}
