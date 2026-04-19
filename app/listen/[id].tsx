import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { Icon } from '../../components/Icon';

type Mode = 'falling' | 'waveform' | 'checklist';

const MODE_LABELS: Record<Mode, string> = {
  falling: 'Falling notes',
  waveform: 'Waveform',
  checklist: 'Beat checklist',
};

function FallingNotes({ theme }: { theme: any }) {
  const notes = [
    { x: 0.15, y: 0.1, label: 'G' },
    { x: 0.35, y: 0.3, label: 'Em' },
    { x: 0.6, y: 0.55, label: 'C' },
    { x: 0.8, y: 0.75, label: 'D' },
  ];
  const w = 320, h = 200;
  return (
    <View style={{ backgroundColor: theme.bgAlt, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width={w} height={h}>
        {/* Falling lines */}
        {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
          <Line key={i} x1={x * w} y1={0} x2={x * w} y2={h} stroke={theme.rule} strokeWidth={1} strokeDasharray="4 4" />
        ))}
        {/* Note blocks */}
        {notes.map((n, i) => (
          <React.Fragment key={i}>
            <Rect x={n.x * w - 18} y={n.y * h - 12} width={36} height={24} rx={6} fill={theme.accent} opacity={0.85 - i * 0.1} />
            <SvgText x={n.x * w} y={n.y * h + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={theme.accentInk}>{n.label}</SvgText>
          </React.Fragment>
        ))}
        {/* Hit zone */}
        <Line x1={0} y1={h - 30} x2={w} y2={h - 30} stroke={theme.accent} strokeWidth={2} opacity={0.4} />
      </Svg>
    </View>
  );
}

function WaveformView({ theme }: { theme: any }) {
  const w = 320, h = 100;
  const points = Array.from({ length: 40 }, (_, i) => ({
    x: (i / 39) * w,
    y: h / 2 + Math.sin(i * 0.4) * 25 + Math.sin(i * 0.9) * 12,
  }));
  const refPoints = Array.from({ length: 40 }, (_, i) => ({
    x: (i / 39) * w,
    y: h / 2 + Math.sin(i * 0.4) * 28 + Math.sin(i * 0.85) * 10,
  }));
  const d = (pts: any[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return (
    <View style={{ backgroundColor: theme.bgAlt, borderRadius: 12, overflow: 'hidden', padding: 8 }}>
      <Svg width={w} height={h}>
        <Path d={d(refPoints)} stroke={theme.inkDim} strokeWidth={1.5} fill="none" opacity={0.4} />
        <Path d={d(points)} stroke={theme.accent} strokeWidth={2} fill="none" />
      </Svg>
      <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 8, paddingBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 20, height: 2, backgroundColor: theme.accent }} />
          <Text style={{ fontSize: 11, color: theme.inkDim }}>Your playing</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 20, height: 2, backgroundColor: theme.inkDim, opacity: 0.4 }} />
          <Text style={{ fontSize: 11, color: theme.inkDim }}>Reference</Text>
        </View>
      </View>
    </View>
  );
}

function BeatChecklist({ theme, song }: { theme: any; song: any }) {
  const items = song.chords.flatMap((c: string) => [
    { chord: c, beat: 1, ok: true },
    { chord: c, beat: 2, ok: Math.random() > 0.3 },
    { chord: c, beat: 3, ok: Math.random() > 0.2 },
    { chord: c, beat: 4, ok: Math.random() > 0.25 },
  ]).slice(0, 12);
  return (
    <View style={{ gap: 8 }}>
      {items.map((item: any, i: number) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: theme.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.rule }}>
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: item.ok ? `${theme.good}20` : `${theme.bad}20`, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={item.ok ? 'check' : 'x'} size={16} color={item.ok ? theme.good : theme.bad} />
          </View>
          <Text style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: 14, color: theme.ink }}>{item.chord}</Text>
          <Text style={{ fontSize: 12, color: theme.inkDim }}>Beat {item.beat}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 11, color: item.ok ? theme.good : theme.bad, fontWeight: '500' }}>
            {item.ok ? 'On time' : 'Missed'}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function ListenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const song = SONGS.find((s) => s.id === id) || SONGS[0];
  const [mode, setMode] = useState<Mode>('falling');
  const [listening, setListening] = useState(false);
  const score = 84;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={22} color={theme.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink }}>Listen & Grade</Text>
          <Text style={{ fontSize: 11, color: theme.inkDim }}>{song.title}</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {/* Mode picker */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              activeOpacity={0.7}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: 8,
                backgroundColor: mode === m ? theme.ink : theme.surface,
                borderWidth: 1, borderColor: mode === m ? theme.ink : theme.rule,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '500', color: mode === m ? theme.bg : theme.ink }}>
                {MODE_LABELS[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Score */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            borderWidth: 6, borderColor: score >= 80 ? theme.good : score >= 60 ? theme.amber : theme.bad,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: theme.surface,
          }}>
            <Text style={{ fontSize: 32, fontWeight: '700', color: theme.ink }}>{score}</Text>
            <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim }}>SCORE</Text>
          </View>
          <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 8 }}>
            {score >= 80 ? 'Great playing! 🎸' : score >= 60 ? 'Getting there!' : 'Keep practising!'}
          </Text>
        </View>

        {/* Visualization */}
        {mode === 'falling' && <FallingNotes theme={theme} />}
        {mode === 'waveform' && <WaveformView theme={theme} />}
        {mode === 'checklist' && <BeatChecklist theme={theme} song={song} />}
      </ScrollView>

      {/* Mic button */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: theme.rule, backgroundColor: theme.bg }}>
        <TouchableOpacity
          onPress={() => setListening(!listening)}
          activeOpacity={0.85}
          style={{
            paddingVertical: 16, borderRadius: 12,
            backgroundColor: listening ? theme.bad : theme.accent,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <Icon name="mic" size={20} color={theme.accentInk} />
          <Text style={{ fontWeight: '600', fontSize: 15, color: theme.accentInk }}>
            {listening ? 'Stop recording' : 'Start recording'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
