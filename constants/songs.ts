export interface SongLine {
  chords: string[];
  syllables: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  mins: string;
  bpm: number;
  key: string;
  difficulty: string;
  difficultyDots: number;
  chords: string[];
  strum: string;
  genre: string;
  color: string;
  gradient: string[];
  plays: string;
  progress: number;
  lines?: SongLine[];
}

export const SONGS: Song[] = [
  {
    id: 'monsoon-letter',
    title: 'Monsoon Letter',
    artist: 'Aarav Sen',
    album: 'Paper Boats',
    mins: '3:42',
    bpm: 78,
    key: 'G',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['G', 'Em', 'C', 'D'],
    strum: 'D DU UDU',
    genre: 'Acoustic',
    color: '#d94f3a',
    gradient: ['#d94f3a', '#7a2416'],
    plays: '2.4M',
    progress: 0.35,
    lines: [
      { chords: ['G', '', 'Em', ''], syllables: ['la', 'la', 'la', 'la'] },
      { chords: ['C', '', 'D', ''], syllables: ['la', 'la', 'la', 'la'] },
      { chords: ['G', '', 'Em', ''], syllables: ['la', 'la', 'la', 'la'] },
      { chords: ['C', 'D', 'G', ''], syllables: ['la', 'la', 'la', 'la'] },
    ],
  },
  {
    id: 'terrace-tea',
    title: 'Terrace Tea',
    artist: 'Meher & the Kites',
    album: 'Balcony Sessions',
    mins: '2:58',
    bpm: 92,
    key: 'C',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['C', 'G', 'Am', 'F'],
    strum: 'D D UDU',
    genre: 'Indie folk',
    color: '#e8a547',
    gradient: ['#e8a547', '#7a4b10'],
    plays: '812K',
    progress: 0.6,
    lines: [
      { chords: ['C', '', 'G', ''], syllables: ['la', 'la', 'la', 'la'] },
      { chords: ['Am', '', 'F', ''], syllables: ['la', 'la', 'la', 'la'] },
    ],
  },
  {
    id: 'auto-rickshaw-radio',
    title: 'Auto-Rickshaw Radio',
    artist: 'Kabir Noon',
    album: 'Yellow Meters',
    mins: '4:05',
    bpm: 104,
    key: 'D',
    difficulty: 'Medium',
    difficultyDots: 2,
    chords: ['D', 'A', 'Bm', 'G'],
    strum: 'DU DU UDU',
    genre: 'Pop rock',
    color: '#4a90e2',
    gradient: ['#4a90e2', '#1a4480'],
    plays: '5.1M',
    progress: 0.1,
    lines: [
      { chords: ['D', '', 'A', ''], syllables: ['la', 'la', 'la', 'la'] },
      { chords: ['Bm', '', 'G', ''], syllables: ['la', 'la', 'la', 'la'] },
    ],
  },
  {
    id: 'silver-window',
    title: 'Silver Window',
    artist: 'The Bandra Three',
    album: 'Night Bus Home',
    mins: '3:20',
    bpm: 86,
    key: 'A',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['A', 'E', 'F#m', 'D'],
    strum: 'D DU D DU',
    genre: 'Acoustic',
    color: '#6b9e7f',
    gradient: ['#6b9e7f', '#2a4a3a'],
    plays: '428K',
    progress: 0,
  },
  {
    id: 'saffron-morning',
    title: 'Saffron Morning',
    artist: 'Noor Ali',
    album: 'Loose Threads',
    mins: '3:12',
    bpm: 72,
    key: 'Em',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['Em', 'C', 'G', 'D'],
    strum: 'D D DU',
    genre: 'Folk',
    color: '#c9783a',
    gradient: ['#c9783a', '#5a2e10'],
    plays: '1.1M',
    progress: 0.78,
  },
  {
    id: 'postcard-weather',
    title: 'Postcard Weather',
    artist: 'Juhi Rao',
    album: 'Slow Trains',
    mins: '2:44',
    bpm: 98,
    key: 'C',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['C', 'Am', 'F', 'G'],
    strum: 'D DU UDU',
    genre: 'Indie pop',
    color: '#b26bc9',
    gradient: ['#b26bc9', '#4a1f5a'],
    plays: '302K',
    progress: 0,
  },
  {
    id: 'khadi-and-kerosene',
    title: 'Khadi & Kerosene',
    artist: 'Old Town Orchestra',
    album: 'Dust Jacket',
    mins: '4:30',
    bpm: 112,
    key: 'G',
    difficulty: 'Medium',
    difficultyDots: 2,
    chords: ['G', 'D', 'Em', 'C', 'Am'],
    strum: 'DU UDU DU',
    genre: 'Rock',
    color: '#3a5a8a',
    gradient: ['#3a5a8a', '#1a2a4a'],
    plays: '1.8M',
    progress: 0,
  },
  {
    id: 'paper-lanterns',
    title: 'Paper Lanterns',
    artist: 'Aarav Sen',
    album: 'Paper Boats',
    mins: '3:05',
    bpm: 84,
    key: 'D',
    difficulty: 'Easy',
    difficultyDots: 1,
    chords: ['D', 'G', 'A'],
    strum: 'D D D D',
    genre: 'Acoustic',
    color: '#d9a23a',
    gradient: ['#d9a23a', '#6a4a10'],
    plays: '956K',
    progress: 0.2,
  },
];

export interface ChordShape {
  frets: number[];
  fingers: number[];
  barre?: number;
}

export const CHORD_SHAPES: Record<string, ChordShape> = {
  G:   { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  C:   { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  D:   { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  Em:  { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  Am:  { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  A:   { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  E:   { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  F:   { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: 1 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barre: 2 },
  Bm:  { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barre: 2 },
};
