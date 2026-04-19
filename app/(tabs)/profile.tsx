import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

const HEATMAP_DATA = [
  [0.9, 0.8, 0.7, 0.5, 0.3, 0.4, 0.2, 0.1, 0.0, 0.0],
  [0.95, 0.9, 0.7, 0.6, 0.5, 0.3, 0.2, 0.1, 0.0, 0.0],
  [0.9, 0.85, 0.8, 0.6, 0.4, 0.3, 0.2, 0.0, 0.0, 0.0],
  [0.7, 0.8, 0.7, 0.5, 0.3, 0.2, 0.1, 0.0, 0.0, 0.0],
  [0.6, 0.7, 0.6, 0.4, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0],
  [0.4, 0.5, 0.4, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const STREAK_DAYS = [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];

function interpolateColor(val: number, low: string, high: string) {
  if (val === 0) return low;
  const pct = val;
  const r1 = parseInt(low.slice(1, 3), 16);
  const g1 = parseInt(low.slice(3, 5), 16);
  const b1 = parseInt(low.slice(5, 7), 16);
  const r2 = parseInt(high.slice(1, 3), 16);
  const g2 = parseInt(high.slice(3, 5), 16);
  const b2 = parseInt(high.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * pct);
  const g = Math.round(g1 + (g2 - g1) * pct);
  const b = Math.round(b1 + (b2 - b1) * pct);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function Goal({ label, value, total, suffix = '', last = false, theme }: any) {
  return (
    <View style={{ paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10, borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.rule }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 13, color: theme.ink }}>{label}</Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.inkDim }}>
          {value}{suffix || `/${total}`}
        </Text>
      </View>
      <View style={{ height: 4, backgroundColor: theme.rule, borderRadius: 2, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${(value / total) * 100}%`, backgroundColor: theme.accent }} />
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const cellW = 28;
  const cellH = 16;
  const heatW = 16 + cellW * 10;
  const heatH = cellH * 6 + 20;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5 }}>Progress</Text>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20 }}>
          {[
            { big: '12', label: 'DAY STREAK', accent: true },
            { big: '8', label: 'SONGS' },
            { big: '87', label: '% AVG' },
          ].map(({ big, label, accent }) => (
            <View
              key={label}
              style={{ flex: 1, padding: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 10 }}
            >
              <Text style={{ fontSize: 26, fontWeight: '600', color: accent ? theme.accent : theme.ink, letterSpacing: -0.5, lineHeight: 30 }}>{big}</Text>
              <Text style={{ fontSize: 9, fontFamily: 'monospace', color: theme.inkDim, marginTop: 4, letterSpacing: 0.5 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Streak calendar */}
        <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink, marginBottom: 12 }}>Last 4 weeks</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {STREAK_DAYS.map((d, i) => (
              <View
                key={i}
                style={{
                  width: (300 - 4 * 6) / 7,
                  aspectRatio: 1,
                  borderRadius: 4,
                  backgroundColor: d ? theme.accent : theme.rule,
                  opacity: d ? 0.3 + (i / 28) * 0.7 : 1,
                }}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={{ fontFamily: 'monospace', fontSize: 9, color: theme.inkMute }}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Fretboard heatmap */}
        <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink }}>Fretboard accuracy</Text>
          <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 2, marginBottom: 12 }}>
            Darker = more confident
          </Text>
          <Svg width={heatW} height={heatH}>
            {/* Fret numbers */}
            {Array.from({ length: 10 }).map((_, fi) => (
              <SvgText key={fi} x={16 + fi * cellW + cellW / 2} y={12} textAnchor="middle" fontSize={9} fill={theme.inkMute} fontFamily="monospace">
                {fi === 0 ? '' : fi}
              </SvgText>
            ))}
            {HEATMAP_DATA.map((row, si) => (
              <React.Fragment key={si}>
                <SvgText x={12} y={20 + si * cellH + cellH / 2 + 3} textAnchor="middle" fontSize={9} fill={theme.inkDim} fontFamily="monospace">
                  {STRINGS[si]}
                </SvgText>
                {row.map((v, fi) => (
                  <Rect
                    key={fi}
                    x={16 + fi * cellW + 1}
                    y={18 + si * cellH}
                    width={cellW - 2}
                    height={cellH - 2}
                    rx={2}
                    fill={interpolateColor(v, theme.rule, theme.accent)}
                  />
                ))}
              </React.Fragment>
            ))}
          </Svg>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 10, color: theme.inkMute }}>LOW</Text>
            <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: theme.rule }} />
            <Text style={{ fontFamily: 'monospace', fontSize: 10, color: theme.inkMute }}>HIGH</Text>
          </View>
        </View>

        {/* Goals */}
        <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink, marginBottom: 14 }}>This week</Text>
          <Goal theme={theme} label="Practice 5 days" value={4} total={5} />
          <Goal theme={theme} label="Finish Monsoon Letter" value={35} total={100} suffix="%" />
          <Goal theme={theme} label="Clean G→C transition" value={82} total={95} suffix="%" last />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
