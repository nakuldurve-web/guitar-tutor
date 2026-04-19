import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

const SCALES = [
  { id: 'penta-minor', label: 'Minor Pentatonic', positions: [[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[2,4],[0,5],[3,5]], root: [0,1] },
  { id: 'penta-major', label: 'Major Pentatonic', positions: [[0,1],[2,1],[4,1],[1,2],[4,2],[1,3],[4,3],[1,4],[4,4],[2,5]], root: [0,1] },
  { id: 'major', label: 'Major Scale', positions: [[0,1],[2,1],[4,1],[1,2],[3,2],[0,3],[2,3],[4,3],[1,4],[3,4],[0,5],[2,5]], root: [0,1] },
];

export default function ScalesScreen() {
  const theme = useTheme();
  const [scalePick, setScalePick] = useState('penta-minor');
  const [bpm, setBpm] = useState(60);

  const scale = SCALES.find((s) => s.id === scalePick) || SCALES[0];
  const cellW = 32, cellH = 28;
  const frets = 6, strings = 6;
  const svgW = 22 + cellW * frets;
  const svgH = cellH * strings + 20;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>Scales & solo lab</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Scale picker */}
        <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Scale</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {SCALES.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setScalePick(s.id)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
                borderWidth: 1, borderColor: scalePick === s.id ? theme.accent : theme.rule,
                backgroundColor: scalePick === s.id ? `${theme.accent}15` : 'transparent',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '500', color: scalePick === s.id ? theme.accent : theme.ink }}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Fretboard diagram */}
        <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink, marginBottom: 12 }}>{scale.label}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Svg width={svgW} height={svgH}>
              {/* String lines */}
              {Array.from({ length: strings }).map((_, si) => (
                <Line key={si} x1={22} y1={20 + si * cellH} x2={svgW} y2={20 + si * cellH} stroke={theme.inkDim} strokeWidth={si === 5 ? 2 : 1} />
              ))}
              {/* Fret lines */}
              {Array.from({ length: frets + 1 }).map((_, fi) => (
                <Line key={fi} x1={22 + fi * cellW} y1={20} x2={22 + fi * cellW} y2={20 + cellH * (strings - 1)} stroke={theme.rule} strokeWidth={fi === 0 ? 3 : 1} />
              ))}
              {/* Scale positions */}
              {scale.positions.map(([fi, si], i) => {
                const cx = 22 + fi * cellW + cellW / 2;
                const cy = 20 + (si - 1) * cellH;
                const isRoot = fi === scale.root[0] && si === scale.root[1];
                return (
                  <Circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill={isRoot ? theme.accent : theme.ink}
                    opacity={isRoot ? 1 : 0.75}
                  />
                );
              })}
            </Svg>
          </ScrollView>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.accent }} />
              <Text style={{ fontSize: 11, color: theme.inkDim }}>Root note</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: theme.ink }} />
              <Text style={{ fontSize: 11, color: theme.inkDim }}>Scale note</Text>
            </View>
          </View>
        </View>

        {/* Speed ladder */}
        <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink, marginBottom: 12 }}>Speed ladder</Text>
          {[60, 80, 100, 120, 140].map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => setBpm(b)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
                borderBottomWidth: b === 140 ? 0 : 1, borderBottomColor: theme.rule,
              }}
            >
              <View style={{
                width: 28, height: 28, borderRadius: 14,
                backgroundColor: bpm === b ? theme.accent : theme.bgAlt,
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
              }}>
                {bpm === b && <Icon name="play" size={12} color={theme.accentInk} />}
              </View>
              <Text style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: '600', color: bpm === b ? theme.accent : theme.ink }}>{b}</Text>
              <Text style={{ fontSize: 11, color: theme.inkDim, marginLeft: 6 }}>BPM</Text>
              <View style={{ flex: 1, marginHorizontal: 12, height: 2, backgroundColor: theme.rule, borderRadius: 1, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${(b / 140) * 100}%`, backgroundColor: bpm >= b ? theme.accent : theme.rule }} />
              </View>
              <Text style={{ fontSize: 11, color: theme.inkDim }}>
                {b <= 60 ? 'Slow' : b <= 80 ? 'Easy' : b <= 100 ? 'Medium' : b <= 120 ? 'Fast' : 'Pro'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
