import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { CHORD_COLORS } from '../../constants/theme';
import { Icon } from '../../components/Icon';

export default function PlayAlongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const song = SONGS.find((s) => s.id === id) || SONGS[0];
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lines = song.lines || [];

  useEffect(() => {
    if (playing) {
      const beatMs = (60 / song.bpm) * 1000;
      intervalRef.current = setInterval(() => {
        setCurrentBeat((b) => {
          const next = b + 1;
          if (next >= 4) {
            setCurrentLine((l) => (l + 1) % (lines.length || 1));
            return 0;
          }
          return next;
        });
      }, beatMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, song.bpm, lines.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: theme.rule,
      }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={22} color={theme.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink }}>{song.title}</Text>
          <Text style={{ fontSize: 11, color: theme.inkDim, fontFamily: 'monospace' }}>{song.bpm} BPM · Key of {song.key}</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      {/* Chord ribbon at top */}
      <View style={{
        flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: theme.rule,
      }}>
        {song.chords.map((c) => (
          <View
            key={c}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
              backgroundColor: `${CHORD_COLORS[c] || theme.accent}22`,
              borderWidth: 1, borderColor: CHORD_COLORS[c] || theme.accent,
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: CHORD_COLORS[c] || theme.ink }}>{c}</Text>
          </View>
        ))}
      </View>

      {/* Scrolling lyrics */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 32 }}>
        {(lines.length > 0 ? lines : Array(4).fill(lines[0] || { chords: song.chords, syllables: ['la', 'la', 'la', 'la'] })).map((line, li) => (
          <View key={li} style={{
            padding: 16, borderRadius: 12,
            backgroundColor: li === currentLine && playing ? `${theme.accent}15` : 'transparent',
            borderWidth: 1,
            borderColor: li === currentLine && playing ? theme.accent : 'transparent',
          }}>
            {/* Chord row */}
            <View style={{ flexDirection: 'row', marginBottom: 8, gap: 0 }}>
              {line.chords.map((c: string, ci: number) => (
                <View key={ci} style={{ flex: 1 }}>
                  {c ? (
                    <Text style={{
                      fontSize: 14, fontWeight: '700', fontFamily: 'monospace',
                      color: li === currentLine && ci === currentBeat && playing
                        ? theme.accent
                        : CHORD_COLORS[c] || theme.ink,
                    }}>
                      {c}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
            {/* Syllables row */}
            <View style={{ flexDirection: 'row' }}>
              {line.syllables.map((s: string, si: number) => (
                <Text key={si} style={{
                  flex: 1, fontSize: 18, color: theme.ink, fontWeight: '400',
                  opacity: li === currentLine && playing ? 1 : 0.5,
                }}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Transport */}
      <View style={{
        paddingHorizontal: 20, paddingVertical: 16,
        borderTopWidth: 1, borderTopColor: theme.rule,
        backgroundColor: theme.bg,
        flexDirection: 'row', alignItems: 'center', gap: 16,
      }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="loop" size={18} color={theme.inkDim} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPlaying(!playing)}
          activeOpacity={0.85}
          style={{
            flex: 1, paddingVertical: 14, backgroundColor: playing ? theme.bgAlt : theme.accent,
            borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10,
          }}
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} color={playing ? theme.ink : theme.accentInk} />
          <Text style={{ fontWeight: '600', fontSize: 15, color: playing ? theme.ink : theme.accentInk }}>
            {playing ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/listen/${song.id}`)}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="mic" size={18} color={theme.inkDim} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
