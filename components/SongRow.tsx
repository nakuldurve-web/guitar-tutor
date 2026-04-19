import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Song } from '../constants/songs';
import { Theme } from '../constants/theme';
import { CoverArt } from './CoverArt';
import { DifficultyDots } from './DifficultyDots';

interface Props {
  song: Song;
  theme: Theme;
  onPress?: () => void;
  showProgress?: boolean;
  progress?: number;
}

export function SongRow({ song, theme, onPress, showProgress, progress = 0 }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingHorizontal: 20 }}
    >
      <CoverArt song={song} size={52} rounded={6} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '500', color: theme.ink }}>
          {song.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={{ fontSize: 12, color: theme.inkDim }}>{song.artist}</Text>
          <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: theme.inkMute }} />
          <Text style={{ fontSize: 11, color: theme.inkDim, fontFamily: 'monospace' }}>{song.key}</Text>
          <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: theme.inkMute }} />
          <DifficultyDots n={song.difficultyDots} theme={theme} />
        </View>
        {showProgress && progress > 0 && (
          <View style={{ marginTop: 6, height: 2, backgroundColor: theme.rule, borderRadius: 1, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: theme.accent }} />
          </View>
        )}
      </View>
      <Text style={{ fontFamily: 'monospace', fontSize: 11, color: theme.inkMute }}>{song.mins}</Text>
    </TouchableOpacity>
  );
}
