import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse } from 'react-native-svg';

interface Props {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }: Props) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'home':
      return <Svg {...p}><Path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V10z" /></Svg>;
    case 'library':
      return <Svg {...p}><Path d="M4 4v16M9 4v16M14 4l6 16" /></Svg>;
    case 'search':
      return <Svg {...p}><Circle cx="11" cy="11" r="7" /><Path d="M21 21l-5-5" /></Svg>;
    case 'profile':
      return <Svg {...p}><Circle cx="12" cy="8" r="4" /><Path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></Svg>;
    case 'play':
      return <Svg {...p}><Path d="M6 4l14 8-14 8V4z" fill={color} stroke="none" /></Svg>;
    case 'pause':
      return <Svg {...p}><Rect x="6" y="4" width="4" height="16" fill={color} stroke="none" /><Rect x="14" y="4" width="4" height="16" fill={color} stroke="none" /></Svg>;
    case 'mic':
      return <Svg {...p}><Rect x="9" y="3" width="6" height="12" rx="3" /><Path d="M5 11a7 7 0 0014 0M12 18v3" /></Svg>;
    case 'headphones':
      return <Svg {...p}><Path d="M3 14a9 9 0 0118 0v5a2 2 0 01-2 2h-2v-7h4M3 14v5a2 2 0 002 2h2v-7H3" /></Svg>;
    case 'metronome':
      return <Svg {...p}><Path d="M7 21L12 3l5 18z" /><Path d="M12 3v14" /><Line x1="12" y1="12" x2="17" y2="8" /></Svg>;
    case 'tuning':
      return <Svg {...p}><Circle cx="12" cy="12" r="9" /><Path d="M12 3v9l5 3" /></Svg>;
    case 'back':
      return <Svg {...p}><Path d="M15 5l-7 7 7 7" /></Svg>;
    case 'more':
      return <Svg {...p}><Circle cx="12" cy="5" r="1" fill={color} /><Circle cx="12" cy="12" r="1" fill={color} /><Circle cx="12" cy="19" r="1" fill={color} /></Svg>;
    case 'heart':
      return <Svg {...p}><Path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z" /></Svg>;
    case 'heart-fill':
      return <Svg {...p}><Path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z" fill={color} /></Svg>;
    case 'filter':
      return <Svg {...p}><Path d="M3 5h18M6 12h12M10 19h4" /></Svg>;
    case 'flame':
      return <Svg {...p}><Path d="M12 3s5 4 5 9a5 5 0 01-10 0c0-3 2-4 2-7 2 2 3 3 3 5a2 2 0 01-2 2" /></Svg>;
    case 'star':
      return <Svg {...p}><Path d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></Svg>;
    case 'check':
      return <Svg {...p}><Path d="M5 12l4 4 10-10" /></Svg>;
    case 'x':
      return <Svg {...p}><Path d="M6 6l12 12M18 6L6 18" /></Svg>;
    case 'speed':
      return <Svg {...p}><Path d="M12 15a6 6 0 10-6-6" /><Path d="M12 15l4-3" /></Svg>;
    case 'loop':
      return <Svg {...p}><Path d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5" /><Path d="M16 3l3 4h-4M8 21l-3-4h4" /></Svg>;
    case 'drill':
      return <Svg {...p}><Path d="M4 12h8M4 8h5M4 16h5" /><Circle cx="17" cy="12" r="4" /></Svg>;
    case 'ar':
      return <Svg {...p}><Path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" /><Circle cx="12" cy="12" r="3" /></Svg>;
    case 'chevron-right':
      return <Svg {...p}><Path d="M9 6l6 6-6 6" /></Svg>;
    case 'chevron-down':
      return <Svg {...p}><Path d="M6 9l6 6 6-6" /></Svg>;
    case 'plus':
      return <Svg {...p}><Path d="M12 5v14M5 12h14" /></Svg>;
    case 'settings':
      return <Svg {...p}><Circle cx="12" cy="12" r="3" /><Path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></Svg>;
    case 'clock':
      return <Svg {...p}><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></Svg>;
    case 'guitar':
      return <Svg {...p}><Path d="M14 4l3 3-2 2 2 2-7 7a3 3 0 11-4-4l7-7 2 2 2-2" /><Circle cx="8" cy="16" r="1.5" /></Svg>;
    case 'import':
      return <Svg {...p}><Path d="M12 3v12M8 11l4 4 4-4" /><Path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></Svg>;
    default:
      return null;
  }
}
