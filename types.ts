
export enum ThumbnailStyle {
  CINEMATIC = 'CINEMATIC',
  CYBERPUNK = 'CYBERPUNK',
  MINIMALIST = 'MINIMALIST',
  HYPE_CLICKBAIT = 'HYPE_CLICKBAIT',
  RETRO_WAVE = 'RETRO_WAVE'
}

export interface StyleConfig {
  id: ThumbnailStyle;
  label: string;
  icon: string;
  promptSuffix: string;
  description: string;
}

export interface GeneratedVariation {
  id: string;
  url: string;
  style: ThumbnailStyle;
  timestamp: number;
}
