import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

const MELODY_NOTES = [
  { string: 'e', fret: 0, note: 'E', beat: 1 },
  { string: 'e', fret: 2, note: 'F#', beat: 2 },
  { string: 'e', fret: 3, note: 'G', beat: 3 },
  { string: 'B', fret: 0, note: 'B', beat: 4 },
  { string: 'B', fret: 1, note: 'C', beat: 5 },
  { string: 'B', fret: 3, note: 'D', beat: 6 },
  { string: 'e', fret: 0, note: 'E', beat: 7 },
  { string: 'e', fret: 2, note: 'F#', beat: 8 },
];

export default function MelodyScreen() {
  const theme = useTheme();
  const [current, setCurrent] = useState(0);

  const note = MELODY_NOTES[current];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>Single-string melody</Text>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        {/* Big cue */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <Text style={{ fontSize: 13, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Note {current + 1} of {MELODY_NOTES.length}
          </Text>

          <View style={{
            width: 160, height: 160, borderRadius: 80,
            backgroundColor: `${theme.accent}15`,
            borderWidth: 4, borderColor: theme.accent,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 60, fontWeight: '700', color: theme.accent, lineHeight: 64 }}>{note.note}</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>
              Pluck string <Text style={{ fontFamily: 'monospace', color: theme.accent }}>{note.string}</Text>
            </Text>
            <Text style={{ fontSize: 24, fontFamily: 'monospace', fontWeight: '700', color: theme.ink, marginTop: 4 }}>
              Fret {note.fret}
            </Text>
            {note.fret === 0 && (
              <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 4 }}>Open string — no finger needed</Text>
            )}
          </View>

          {/* Note ribbon */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
            {MELODY_NOTES.map((n, i) => (
              <View
                key={i}
                style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: i === current ? theme.accent : i < current ? `${theme.accent}30` : theme.bgAlt,
                  borderWidth: 2, borderColor: i === current ? theme.accent : theme.rule,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: i === current ? theme.accentInk : i < current ? theme.accent : theme.inkDim }}>
                  {n.note}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setCurrent(Math.max(0, current - 1))}
            activeOpacity={0.8}
            style={{ flex: 1, paddingVertical: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '500', color: theme.ink }}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrent(Math.min(MELODY_NOTES.length - 1, current + 1))}
            activeOpacity={0.85}
            style={{ flex: 1, paddingVertical: 14, backgroundColor: theme.accent, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600', color: theme.accentInk }}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
