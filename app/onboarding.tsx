import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

type Step = 'skill' | 'tuner' | 'done';

const TUNER_STRINGS = [
  { note: 'E', string: 6, freq: '82 Hz', bar: 0.5 },
  { note: 'A', string: 5, freq: '110 Hz', bar: 0.72 },
  { note: 'D', string: 4, freq: '147 Hz', bar: 0.88 },
  { note: 'G', string: 3, freq: '196 Hz', bar: 0.45 },
  { note: 'B', string: 2, freq: '247 Hz', bar: 0.62 },
  { note: 'e', string: 1, freq: '330 Hz', bar: 0.95 },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const [step, setStep] = useState<Step>('skill');
  const [skill, setSkill] = useState<string | null>(null);
  const [tuned, setTuned] = useState<Set<number>>(new Set());

  if (step === 'skill') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 20, paddingBottom: 0 }}>
          <Icon name="x" size={22} color={theme.inkDim} />
        </TouchableOpacity>
        <View style={{ flex: 1, padding: 28 }}>
          <Text style={{ fontSize: 11, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Step 1 of 2
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '500', color: theme.ink, marginTop: 12, letterSpacing: -0.5, lineHeight: 38 }}>
            What's your guitar level?
          </Text>
          <Text style={{ fontSize: 15, color: theme.inkDim, marginTop: 8, lineHeight: 22 }}>
            We'll tailor the experience and suggest songs that match where you're at.
          </Text>

          <View style={{ gap: 12, marginTop: 32 }}>
            {[
              { id: 'beginner', label: 'Complete beginner', desc: 'Never held a guitar' },
              { id: 'some', label: 'Some experience', desc: 'Know a few chords' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Play songs regularly' },
              { id: 'advanced', label: 'Advanced', desc: 'Looking to polish technique' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSkill(opt.id)}
                activeOpacity={0.8}
                style={{
                  padding: 16, borderRadius: 12,
                  borderWidth: 2, borderColor: skill === opt.id ? theme.accent : theme.rule,
                  backgroundColor: skill === opt.id ? `${theme.accent}10` : theme.surface,
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                }}
              >
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: skill === opt.id ? theme.accent : theme.bgAlt,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  {skill === opt.id && <Icon name="check" size={16} color={theme.accentInk} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink }}>{opt.label}</Text>
                  <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 1 }}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => skill && setStep('tuner')}
            activeOpacity={0.85}
            style={{
              marginTop: 32, paddingVertical: 16,
              backgroundColor: skill ? theme.accent : theme.rule,
              borderRadius: 12, alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 16, color: skill ? theme.accentInk : theme.inkMute }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'tuner') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 0, justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => setStep('skill')} activeOpacity={0.7}>
            <Icon name="back" size={22} color={theme.inkDim} />
          </TouchableOpacity>
          <Text style={{ fontSize: 11, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5 }}>STEP 2 OF 2</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={{ flex: 1, padding: 28 }}>
          <Text style={{ fontSize: 32, fontWeight: '500', color: theme.ink, letterSpacing: -0.5, lineHeight: 38 }}>
            Let's tune your guitar
          </Text>
          <Text style={{ fontSize: 15, color: theme.inkDim, marginTop: 8, lineHeight: 22 }}>
            Play each string — we'll listen and confirm when it's in tune.
          </Text>

          <View style={{ gap: 10, marginTop: 28 }}>
            {TUNER_STRINGS.map((s) => {
              const done = tuned.has(s.string);
              return (
                <TouchableOpacity
                  key={s.string}
                  onPress={() => setTuned((prev) => new Set([...prev, s.string]))}
                  activeOpacity={0.8}
                  style={{
                    padding: 14, borderRadius: 10,
                    backgroundColor: done ? `${theme.good}15` : theme.surface,
                    borderWidth: 1, borderColor: done ? theme.good : theme.rule,
                    flexDirection: 'row', alignItems: 'center', gap: 12,
                  }}
                >
                  <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: done ? theme.good : theme.bgAlt,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done
                      ? <Icon name="check" size={18} color="#fff" />
                      : <Text style={{ fontSize: 18, fontWeight: '700', color: theme.ink }}>{s.note}</Text>
                    }
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink }}>String {s.string} — {s.note}</Text>
                    <Text style={{ fontSize: 11, fontFamily: 'monospace', color: theme.inkDim }}>{s.freq}</Text>
                  </View>
                  <View style={{ width: 80, height: 4, backgroundColor: theme.rule, borderRadius: 2, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${s.bar * 100}%`, backgroundColor: done ? theme.good : theme.accent }} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => tuned.size === 6 && router.back()}
            activeOpacity={0.85}
            style={{
              marginTop: 28, paddingVertical: 16,
              backgroundColor: tuned.size === 6 ? theme.accent : theme.rule,
              borderRadius: 12, alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 16, color: tuned.size === 6 ? theme.accentInk : theme.inkMute }}>
              {tuned.size === 6 ? "All tuned! Let's go 🎸" : `Tune ${6 - tuned.size} more strings`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
