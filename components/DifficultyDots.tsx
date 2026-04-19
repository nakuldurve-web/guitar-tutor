import React from 'react';
import { View } from 'react-native';
import { Theme } from '../constants/theme';

interface Props {
  n: number;
  theme: Theme;
}

export function DifficultyDots({ n, theme }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: i <= n ? theme.accent : theme.rule,
          }}
        />
      ))}
    </View>
  );
}
