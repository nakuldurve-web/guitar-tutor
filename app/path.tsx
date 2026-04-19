import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';
import { useApp } from '../store/AppContext';

const STEPS = [
  { id: 'notefinder', label: 'Note finder', desc: 'Learn the names of every note on the fretboard', tappable: true },
  { id: 'melody', label: 'Single-string melody', desc: 'Play your first melody one note at a time', tappable: true },
  { id: 'picking', label: 'Finger-picking basics', desc: 'p·i·m·a pattern on individual strings', tappable: true },
  { id: 'scales', label: 'Pentatonic scale', desc: 'The foundation of all lead guitar playing', tappable: true },
  { id: 'chords-intro', label: 'Your first chord: Em', desc: 'Two fingers, the easiest beginner chord', tappable: false },
  { id: 'chords-g', label: 'Add G major', desc: 'Now you can play thousands of songs', tappable: false },
  { id: 'songs', label: 'Play a full song', desc: "You're ready — pick a song from the library!", tappable: false },
];

export default function PathScreen() {
  const theme = useTheme();
  const { state, dispatch } = useApp();

  const handleStep = (step: typeof STEPS[number]) => {
    if (step.tappable) {
      dispatch({ type: 'COMPLETE_PATH_STEP', stepId: step.id });
      router.push(`/${step.id}` as any);
    }
  };

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
        <Text style={{ fontFamily: 'monospace', fontSize: 11, color: theme.inkDim }}>
          {state.pathProgress.length}/{STEPS.length}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 14, color: theme.inkDim, marginBottom: 8, lineHeight: 20 }}>
          Start here if you've never played guitar. These exercises build your finger strength and fretboard awareness before you tackle chords.
        </Text>

        {STEPS.map((step, i) => {
          const done = state.pathProgress.includes(step.id);
          return (
            <TouchableOpacity
              key={step.id}
              onPress={() => handleStep(step)}
              activeOpacity={step.tappable ? 0.8 : 1}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                padding: 16, backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: done ? theme.good : theme.rule,
                borderRadius: 12,
                opacity: step.tappable || done ? 1 : 0.5,
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: done ? `${theme.good}20` : step.tappable ? theme.bgAlt : theme.rule,
                alignItems: 'center', justifyContent: 'center',
              }}>
                {done
                  ? <Icon name="check" size={18} color={theme.good} />
                  : <Text style={{ fontFamily: 'monospace', fontWeight: '700', color: step.tappable ? theme.ink : theme.inkMute }}>{i + 1}</Text>
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: done || step.tappable ? theme.ink : theme.inkDim }}>{step.label}</Text>
                <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 2 }}>{step.desc}</Text>
              </View>
              {step.tappable && !done && <Icon name="chevron-right" size={18} color={theme.inkDim} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
