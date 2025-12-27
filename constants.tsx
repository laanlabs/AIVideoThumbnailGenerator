
import { ThumbnailStyle, StyleConfig } from './types';

export const STYLE_CONFIGS: StyleConfig[] = [
  {
    id: ThumbnailStyle.CINEMATIC,
    label: 'Cinematic',
    icon: 'fa-film',
    description: 'Dramatic lighting, shallow depth of field, and movie-poster aesthetics.',
    promptSuffix: 'Reimagine this thumbnail in a cinematic movie poster style. The man should look thoughtful with dramatic side-lighting. The background should be a blurred, high-end technology lab. Replace the phone icon with a sleek, realistic high-tech smartphone glowing with data. Add premium serif typography: "THE VALUE OF APPS 2026". 4k, photorealistic.'
  },
  {
    id: ThumbnailStyle.CYBERPUNK,
    label: 'Cyberpunk',
    icon: 'fa-microchip',
    description: 'Neon glows, glitch effects, and futuristic urban vibes.',
    promptSuffix: 'Transform this into a cyberpunk aesthetic. Use vibrant neon cyan, magenta, and green highlights. The man should have subtle cybernetic details. The phone should be a floating hologram showing currency symbols. Background is a rainy futuristic city at night. Bold glitchy text: "APP FUTURE 2026".'
  },
  {
    id: ThumbnailStyle.MINIMALIST,
    label: 'Modern Clean',
    icon: 'fa-leaf',
    description: 'Sleek, professional, and clutter-free presentation.',
    promptSuffix: 'Create a clean, Apple-style modern tech thumbnail. Soft, neutral studio background with elegant geometric patterns. High-resolution realistic smartphone with a beautiful interface. Use premium sans-serif typography: "App Economy 2026". Minimalist color palette of whites, soft greys, and one accent color.'
  },
  {
    id: ThumbnailStyle.HYPE_CLICKBAIT,
    label: 'High-Hype',
    icon: 'fa-fire',
    description: 'Bright colors, high energy, and maximum clickability.',
    promptSuffix: 'Maximum energy YouTube thumbnail. Saturated colors, high contrast. Add explosive graphics and sparks behind the smartphone. The man should have a more expressive, amazed facial expression. Massive bold yellow text with heavy black shadows: "HUGE PROFIT 2026?". High-impact visuals.'
  },
  {
    id: ThumbnailStyle.RETRO_WAVE,
    label: 'Retro Wave',
    icon: 'fa-music',
    description: '80s synthwave style with purple gradients and grid lines.',
    promptSuffix: 'Transform this into an 80s synthwave/retrowave aesthetic. Purple and orange sunset color palette. A digital wireframe grid on the ground. The phone is a classic blocky 80s cell phone with glowing neon lines. Retro "SEGA-style" chrome typography: "2026 APP VALUE".'
  }
];
