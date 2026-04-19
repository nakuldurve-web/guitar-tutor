import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/Icon';
import { ChordDiagram } from '../../components/ChordDiagram';

const DRILLS = [
  { id: 'g-c-d', label: 'G → C → D', desc: 'Core beginner progression', mins: '3 min', chords: ['G', 'C', 'D'] },
  { id: 'em-c-g-d', label: 'Em → C → G → D', desc: 'Emotional pop staple', mins: '4 min', chords: ['Em', 'C', 'G', 'D'] },
  { id: 'a-e-d', label: 'A → E → D', desc: 'Country/folk feel', mins: '3 min', chords: ['A', 'E', 'D'] },
  { id: 'c-am-f-g', label: 'C → Am → F → G', desc: 'The "50s" doo-wop loop', mins: '4 min', chords: ['C', 'Am', 'F', 'G'] },
];

const STRUM_PATTERNS = [
  { id: 'basic', label: 'Basic down', pattern: 'D D D D', bpm: 60 },
  { id: 'folk', label: 'Folk groove', pattern: 'D DU UDU', bpm: 80 },
  { id: 'pop', label: 'Pop eight', pattern: 'DU DU DU DU', bpm: 90 },
];

export default function DrillsScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  const [strumPick, setStrumPick] = useState('basic');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5 }}>Drills</Text>
          <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 4 }}>Focused exercises to build muscle memory</Text>
        </View>

        {/* Chord transition drills */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Chord transitions
          </Text>
        </View>

        {DRILLS.map((drill) => (
          <TouchableOpacity
            key={drill.id}
            onPress={() => setSelected(selected === drill.id ? null : drill.id)}
            activeOpacity={0.8}
            style={{
              marginHorizontal: 20, marginBottom: 10,
              padding: 16, backgroundColor: theme.surface,
              borderWidth: 1, borderColor: selected === drill.id ? theme.accent : theme.rule,
              borderRadius: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink, fontFamily: 'monospace' }}>{drill.label}</Text>
                <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 2 }}>{drill.desc} · {drill.mins}</Text>
              </View>
              <Icon name="chevron-right" size={18} color={selected === drill.id ? theme.accent : theme.inkDim} />
            </View>

            {selected === drill.id && (
              <View style={{ marginTop: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                  {drill.chords.map((c) => (
                    <View key={c} style={{ alignItems: 'center' }}>
                      <ChordDiagram name={c} size={1.1} theme={theme} showName />
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    marginTop: 16, paddingVertical: 12, backgroundColor: theme.accent,
                    borderRadius: 10, alignItems: 'center',
                  }}
                >
                  <Text style={{ color: theme.accentInk, fontWeight: '600', fontSize: 14 }}>Start drill</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Strumming patterns */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Strumming patterns
          </Text>
        </View>

        {STRUM_PATTERNS.map((sp) => (
          <TouchableOpacity
            key={sp.id}
            onPress={() => setStrumPick(sp.id)}
            activeOpacity={0.8}
            style={{
              marginHorizontal: 20, marginBottom: 10,
              padding: 16, backgroundColor: theme.surface,
              borderWidth: 1, borderColor: strumPick === sp.id ? theme.accent : theme.rule,
              borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 14,
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 8,
              backgroundColor: strumPick === sp.id ? `${theme.accent}20` : theme.bgAlt,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="metronome" size={20} color={strumPick === sp.id ? theme.accent : theme.inkDim} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink }}>{sp.label}</Text>
              <Text style={{ fontSize: 13, fontFamily: 'monospace', color: theme.accent, marginTop: 2 }}>{sp.pattern}</Text>
              <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 1 }}>{sp.bpm} BPM</Text>
            </View>
            {strumPick === sp.id && <Icon name="check" size={18} color={theme.accent} />}
          </TouchableOpacity>
        ))}

        {/* AR overlay promo */}
        <View style={{
          marginHorizontal: 20, marginTop: 20,
          padding: 16, backgroundColor: theme.surface,
          borderWidth: 1, borderColor: theme.rule, borderRadius: 12,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ar" size={24} color={theme.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: theme.ink }}>AR hand overlay</Text>
              <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 2 }}>See correct finger placement on your guitar</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ marginTop: 14, paddingVertical: 10, backgroundColor: theme.bgAlt, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.ink }}>Coming soon</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
