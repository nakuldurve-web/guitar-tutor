import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

const STEPS = [
  { id: 'notefinder', label: 'Note finder', desc: 'Learn the names of every note on the fretboard', icon: 'guitar', done: true },
  { id: 'melody', label: 'Single-string melody', desc: 'Play your first melody one note at a time', icon: 'play', done: true },
  { id: 'picking', label: 'Finger-picking basics', desc: 'p·i·m·a pattern on individual strings', icon: 'metronome', done: false },
  { id: 'scales', label: 'Pentatonic scale', desc: 'The foundation of all lead guitar playing', icon: 'drill', done: false },
  { id: 'chords-intro', label: 'Your first chord: Em', desc: 'Two fingers, the easiest beginner chord', icon: 'check', done: false },
  { id: 'chords-g', label: 'Add G major', desc: 'Now you can play thousands of songs', icon: 'check', done: false },
  { id: 'songs', label: 'Play a full song', desc: 'You\'re ready — pick a song from the library!', icon: 'library', done: false },
];

export default function PathScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Before chords</Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>Learning path</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 14, color: theme.inkDim, marginBottom: 8, lineHeight: 20 }}>
          Start here if you've never played guitar. These exercises build your finger strength and fretboard awareness before you tackle chords.
        </Text>

        {STEPS.map((step, i) => {
          const canTap = step.id === 'notefinder' || step.id === 'melody' || step.id === 'picking' || step.id === 'scales';
          return (
            <TouchableOpacity
              key={step.id}
              onPress={() => canTap ? router.push(`/${step.id}` as any) : undefined}
              activeOpacity={canTap ? 0.8 : 1}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                padding: 16, backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: step.done ? theme.good : canTap ? theme.rule : theme.rule,
                borderRadius: 12,
                opacity: canTap || step.done ? 1 : 0.5,
              }}
            >
              {/* Step number or check */}
              <View style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: step.done ? `${theme.good}20` : canTap ? theme.bgAlt : theme.rule,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {step.done
                  ? <Icon name="check" size={18} color={theme.good} />
                  : <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: canTap ? theme.ink : theme.inkMute }}>{i + 1}</Text>
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: step.done || canTap ? theme.ink : theme.inkDim }}>{step.label}</Text>
                <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 2 }}>{step.desc}</Text>
              </View>
              {canTap && !step.done && <Icon name="chevron-right" size={18} color={theme.inkDim} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
