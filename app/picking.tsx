import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

const PATTERN = [
  { finger: 'p', string: 'E', label: 'Thumb — low E string' },
  { finger: 'i', string: 'G', label: 'Index — G string' },
  { finger: 'm', string: 'B', label: 'Middle — B string' },
  { finger: 'a', string: 'e', label: 'Ring — high e string' },
  { finger: 'm', string: 'B', label: 'Middle — B string' },
  { finger: 'i', string: 'G', label: 'Index — G string' },
];

const FINGER_COLORS: Record<string, string> = {
  p: '#d94f3a',
  i: '#4a90e2',
  m: '#6b9e7f',
  a: '#b26bc9',
};

export default function PickingScreen() {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const current = PATTERN[step];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>Finger-picking</Text>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        {/* Finger legend */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
          {Object.entries(FINGER_COLORS).map(([f, c]) => (
            <View key={f} style={{ flex: 1, padding: 10, backgroundColor: `${c}20`, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: c }}>{f}</Text>
              <Text style={{ fontSize: 9, fontFamily: 'monospace', color: theme.inkDim, marginTop: 2 }}>
                {f === 'p' ? 'PULGAR' : f === 'i' ? 'INDICE' : f === 'm' ? 'MEDIO' : 'ANULAR'}
              </Text>
            </View>
          ))}
        </View>

        {/* Big finger cue */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <Text style={{ fontSize: 11, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Step {step + 1} of {PATTERN.length}
          </Text>

          <View style={{
            width: 120, height: 120, borderRadius: 60,
            backgroundColor: `${FINGER_COLORS[current.finger]}20`,
            borderWidth: 4, borderColor: FINGER_COLORS[current.finger],
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 56, fontWeight: '700', color: FINGER_COLORS[current.finger], lineHeight: 60 }}>
              {current.finger}
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '500', color: theme.ink }}>{current.label}</Text>
            <Text style={{ fontSize: 15, color: theme.inkDim, marginTop: 4 }}>
              Pluck string <Text style={{ fontFamily: 'monospace', color: theme.accent, fontWeight: '600' }}>{current.string}</Text>
            </Text>
          </View>

          {/* Pattern strip */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {PATTERN.map((p, i) => (
              <View
                key={i}
                style={{
                  width: 40, height: 48, borderRadius: 8,
                  backgroundColor: i === step ? FINGER_COLORS[p.finger] : `${FINGER_COLORS[p.finger]}25`,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '700', color: i === step ? '#fff' : FINGER_COLORS[p.finger] }}>{p.finger}</Text>
                <Text style={{ fontSize: 9, fontFamily: 'monospace', color: i === step ? 'rgba(255,255,255,0.8)' : theme.inkDim }}>{p.string}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setStep(Math.max(0, step - 1))}
            activeOpacity={0.8}
            style={{ flex: 1, paddingVertical: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '500', color: theme.ink }}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setStep((step + 1) % PATTERN.length)}
            activeOpacity={0.85}
            style={{ flex: 1, paddingVertical: 14, backgroundColor: FINGER_COLORS[current.finger], borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600', color: '#fff' }}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
