
const DEFAULT_TILE_TYPES = {
  NONE: 0,
  FOREST: 1,
  MOUNTAIN: 2,
  PLAIN: 3,
  WATER: 4,
}

export const TILE_TYPES = {
  ...DEFAULT_TILE_TYPES,
  sample: () => {
    const keys = Object.keys(DEFAULT_TILE_TYPES).filter(key => key !== DEFAULT_TILE_TYPES.NONE);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return DEFAULT_TILE_TYPES[randomKey];
  }
}

const BLACK_WHITE = {
  [TILE_TYPES.NONE]: {
    character: ' ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.WATER]: {
    character: ' ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.FOREST]: {
    character: 't',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.MOUNTAIN]: {
    character: 'M',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.PLAIN]: {
    character: '_',
    background: 'black',
    foreground: 'white',
  },
}

const ASCII = {
  [TILE_TYPES.NONE]: {
    character: ' ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.WATER]: {
    character: '  ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.PLAIN]: {
    character: ' ·',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.FOREST]: {
    character: ' ♣',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.MOUNTAIN]: {
    character: '▲▲',
    background: 'black',
    foreground: 'white',
  },
}

const HAN_ZI = {
  [TILE_TYPES.NONE]: {
    character: ' ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.WATER]: {
    // character: '水',
    // character: '。',
    character: ' ',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.FOREST]: {
    // character: '木',
    // character: '工',
    character: '。',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.MOUNTAIN]: {
    character: '山',
    background: 'black',
    foreground: 'white',
  },
  [TILE_TYPES.PLAIN]: {
    // character: '花',
    character: '一',
    // character: '。',
    background: 'black',
    foreground: 'white',
  },
}

export const THEME = {
  BLACK_WHITE,
  HAN_ZI,
  ASCII,
  DEFAULT: BLACK_WHITE,
}

export default {
  THEME,
  TILE_TYPES,
}