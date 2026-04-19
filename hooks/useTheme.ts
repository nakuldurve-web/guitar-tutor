import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/theme';

export type Theme = typeof COLORS.light | typeof COLORS.dark;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? COLORS.dark : COLORS.light;
}
