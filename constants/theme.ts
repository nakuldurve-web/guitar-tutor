export const COLORS = {
  light: {
    bg: '#faf7f2',
    bgAlt: '#f2ede3',
    surface: '#ffffff',
    ink: '#1a1a1a',
    inkDim: '#6b665e',
    inkMute: '#a8a298',
    rule: '#e8e2d5',
    accent: '#d94f3a',
    accentInk: '#fff',
    sage: '#6b9e7f',
    amber: '#c9833a',
    good: '#4a9a6b',
    bad: '#c94a4a',
  },
  dark: {
    bg: '#141310',
    bgAlt: '#1d1c18',
    surface: '#24221e',
    ink: '#f2ede3',
    inkDim: '#a8a298',
    inkMute: '#6b665e',
    rule: '#2f2c26',
    accent: '#e8654f',
    accentInk: '#141310',
    sage: '#8abf9f',
    amber: '#d99b5a',
    good: '#6bc48a',
    bad: '#e07474',
  },
} as const;

export type Theme = typeof COLORS.light | typeof COLORS.dark;

export const FONTS = {
  serif: 'serif',
  sans: 'System',
  mono: 'monospace',
} as const;

export const CHORD_COLORS: Record<string, string> = {
  G: '#e8c547',
  C: '#d94f3a',
  D: '#4a90e2',
  Em: '#6b9e7f',
  Am: '#b26bc9',
  A: '#e89547',
  A7: '#d4854a',
  E: '#4ac9b0',
  F: '#c94a6b',
  Dm: '#c97a4a',
  Bb: '#7a6bc9',
  B: '#c94a4a',
  Cm: '#4a9a7a',
  'F#m': '#8a6bc9',
  Bm: '#3a8ac9',
  Em7: '#5a9e7f',
  Cadd9: '#e05a3a',
  Dsus4: '#5a7ae2',
  Asus4: '#e8a047',
  A7sus4: '#e8a047',
};
