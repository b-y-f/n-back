export interface ConfusionMatrix {
  TP: number;
  TN: number;
  FP: number;
  FN: number;
  precision: string;
}

export interface GameConfig {
  sound_idx: number;
  n_sound: number;
  trail: number;
  nback: number;
  interval: number;
  sound_type: string;
}
