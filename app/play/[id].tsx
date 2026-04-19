import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS, CHORD_SHAPES } from '../../constants/songs';
import { CHORD_COLORS } from '../../constants/theme';
import { Icon } from '../../components/Icon';
import { playChord, playTabSequence } from '../../utils/audioEngine';
import { useApp } from '../../store/AppContext';

function buildNoteSequence(chords: string[]): { stringIndex: number; fret: number }[] {
  const notes: { stringIndex: number; fret: number }[] = [];
  for (const chord of chords) {
    const shape = CHORD_SHAPES[chord];
    if (!shape) continue;
    for (let si = 0; si < shape.frets.length; si++) {
      if (shape.frets[si] >= 0) notes.push({ stringIndex: si, fret: shape.frets[si] });
    }
    notes.push({ stringIndex: 0, fret: -1 });
  }
  return notes;
}

export default function PlayAlongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { dispatch } = useApp();
  const song = SONGS.find((s) => s.id === id) || SONGS[0];
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lines = song.lines || [];

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!playing) return;
    const beatMs = (60 / song.bpm) * 1000;
    intervalRef.current = setInterval(() => {
      setCurrentBeat((b) => {
        const next = (b + 1) % 4;
        if (next === 0) setCurrentLine((l) => (l + 1) % Math.max(lines.length, 1));
        return next;
      });
    }, beatMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, song.bpm, lines.length]);

  const handlePlay = async () => {
    const next = !playing;
    setPlaying(next);
    if (next) {
      if (!sessionStarted) {
        dispatch({ type: 'PRACTICE_SONG', songId: song.id });
        setSessionStarted(true);
      }
      const notes = buildNoteSequence(song.chords);
      await playTabSequence([...notes, ...notes], song.bpm * 2);
    }
  };

  const handleChordTap = async (chord: string) => {
    const shape = CHORD_SHAPES[chord];
    if (shape) await playChord(shape.frets);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
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

      {/* Tappable chord ribbon */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
          Tap a chord to hear it
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {song.chords.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => handleChordTap(c)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
                backgroundColor: `${CHORD_COLORS[c] || theme.accent}22`,
                borderWidth: 1.5, borderColor: CHORD_COLORS[c] || theme.accent,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 16, color: CHORD_COLORS[c] || theme.ink }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scrolling lyrics */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 24 }}>
        {(lines.length > 0
          ? lines
          : Array(4).fill({ chords: song.chords.slice(0, 4), syllables: ['la', 'la', 'la', 'la'] })
        ).map((line: any, li: number) => (
          <View key={li} style={{
            padding: 14, borderRadius: 12,
            backgroundColor: li === currentLine && playing ? `${theme.accent}15` : 'transparent',
            borderWidth: 1,
            borderColor: li === currentLine && playing ? theme.accent : 'transparent',
          }}>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {line.chords.map((c: string, ci: number) => (
                <View key={ci} style={{ flex: 1 }}>
                  {c ? (
                    <Text style={{
                      fontSize: 15, fontWeight: '700', fontFamily: 'monospace',
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
            <View style={{ flexDirection: 'row' }}>
              {line.syllables.map((s: string, si: number) => (
                <Text key={si} style={{ flex: 1, fontSize: 18, color: theme.ink, opacity: li === currentLine && playing ? 1 : 0.4 }}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Transport */}
      <View style={{
        paddingHorizontal: 20, paddingVertical: 16,
        borderTopWidth: 1, borderTopColor: theme.rule,
        backgroundColor: theme.bg,
        flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="loop" size={18} color={theme.inkDim} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlay}
          activeOpacity={0.85}
          style={{
            flex: 1, paddingVertical: 14,
            backgroundColor: playing ? theme.bgAlt : theme.accent,
            borderRadius: 12, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 10,
          }}
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} color={playing ? theme.ink : theme.accentInk} />
          <Text style={{ fontWeight: '600', fontSize: 15, color: playing ? theme.ink : theme.accentInk }}>
            {playing ? 'Stop' : 'Play chords'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/listen/${song.id}`)}
          activeOpacity={0.7}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="mic" size={18} color={theme.inkDim} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
