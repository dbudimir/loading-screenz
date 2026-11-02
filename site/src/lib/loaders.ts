export type Loader = {
  id: string;
  name: string;
  category: 'game' | 'console';
  blurb: string;
};

// Mirrors BUILT_IN_LOADERS in the extension (../src/shared/loaders.ts). Videos come from public/media/<id>.mp4.
export const LOADERS: Loader[] = [
  {
    id: 'halo',
    name: 'Halo',
    category: 'game',
    blurb: 'The Pillar of Autumn awaits. Blue glyphs, monks chanting. Legendary.',
  },
  {
    id: 'resident-evil',
    name: 'Resident Evil',
    category: 'game',
    blurb: 'A door creaks open in the dark. You know exactly what this means.',
  },
  {
    id: 'gta-san-andreas',
    name: 'GTA: San Andreas',
    category: 'game',
    blurb: 'Grove Street, home. Hand-painted art and that loading bar.',
  },
  {
    id: 'crash-bandicoot',
    name: 'Crash Bandicoot',
    category: 'game',
    blurb: 'Tumble down the warp tunnel with Crash. Whoa!',
  },
  {
    id: 'star-wars-battlefront',
    name: 'Star Wars Battlefront',
    category: 'game',
    blurb: 'From a distant galaxy down to Kashyyyk. The Clone Wars are one load away.',
  },
  {
    id: 'ps2',
    name: 'PlayStation 2',
    category: 'console',
    blurb: 'Towers rise from the blue void. The hum hits your chest.',
  },
  { id: 'gamecube', name: 'GameCube', category: 'console', blurb: 'The little cube rolls in. Ba-dum, ba-dum, bing!' },
  { id: 'xbox', name: 'Xbox', category: 'console', blurb: 'Green goo, glowing core, total system power-up.' },
  { id: 'dreamcast', name: 'Dreamcast', category: 'console', blurb: 'The orange swirl on pure white. It thinks.' },
];

export const loaderSrc = (id: string) => `/media/${id}.mp4`;
