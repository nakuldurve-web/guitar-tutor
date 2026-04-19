import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { useApp, calcStreak, calcAvgScore } from '../../store/AppContext';
import { SONGS } from '../../constants/songs';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];

function interpolateColor(val: number, low: string, high: string) {
  if (val === 0) return low;
  const r1 = parseInt(low.slice(1, 3), 16), g1 = parseInt(low.slice(3, 5), 16), b1 = parseInt(low.slice(5, 7), 16);
  const r2 = parseInt(high.slice(1, 3), 16), g2 = parseInt(high.slice(3, 5), 16), b2 = parseInt(high.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * val);
  const g = Math.round(g1 + (g2 - g1) * val);
  const b = Math.round(b1 + (b2 - b1) * val);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { state, dispatch } = useApp();

  const streak = calcStreak(state.practiceHistory);
  const songsStarted = Object.keys(state.songProgress).length;
  const avgScore = calcAvgScore(state.songScores);

  // Build last 28 days calendar
  const today = new Date();
  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().slice(0, 10);
  });

  // Build per-song session count for heatmap (fake spatial mapping since we track by song not string/fret)
  // Show a simple fretboard heatmap derived from songScores — higher score = more "used" frets
  const songScoreVals = Object.values(state.songScores);
  const hasScores = songScoreVals.length > 0;
  const HEATMAP_DATA = STRINGS.map((_, si) =>
    Array.from({ length: 10 }, (_, fi) => {
      if (!hasScores) return 0;
      const base = songScoreVals.reduce((a, b) => a + b, 0) / songScoreVals.length / 100;
      return Math.max(0, Math.min(1, base - (si * 0.05) - (fi * 0.03) + Math.sin(si + fi) * 0.1));
    })
  );

  const cellW = 28, cellH = 16;
  const heatW = 16 + cellW * 10;
  const heatH = cellH * 6 + 20;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5 }}>Progress</Text>
          {state.userName ? (
            <Text style={{ fontSize: 14, color: theme.inkDim, marginTop: 2 }}>{state.userName}</Text>
          ) : null}
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20 }}>
          {[
            { big: streak > 0 ? String(streak) : '—', label: 'DAY STREAK', accent: streak > 0 },
            { big: String(songsStarted), label: 'SONGS STARTED' },
            { big: avgScore > 0 ? String(avgScore) : '—', label: '% AVG SCORE' },
          ].map(({ big, label, accent }) => (
            <View key={label} style={{ flex: 1, padding: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 10 }}>
              <Text style={{ fontSize: 26, fontWeight: '600', color: accent ? theme.accent : theme.ink, letterSpacing: -0.5, lineHeight: 30 }}>{big}</Text>
              <Text style={{ fontSize: 9, fontFamily: 'monospace', color: theme.inkDim, marginTop: 4, letterSpacing: 0.5 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Streak calendar — last 28 days */}
        <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink, marginBottom: 12 }}>Last 4 weeks</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {last28.map((date, i) => {
              const practiced = state.practiceHistory.includes(date);
              return (
                <View
                  key={i}
                  style={{
                    width: (300 - 4 * 6) / 7,
                    aspectRatio: 1,
                    borderRadius: 4,
                    backgroundColor: practiced ? theme.accent : theme.rule,
                    opacity: practiced ? 0.85 : 0.4,
                  }}
                />
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={{ fontFamily: 'monospace', fontSize: 9, color: theme.inkMute }}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Fretboard heatmap */}
        <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink }}>Fretboard activity</Text>
          <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 2, marginBottom: 12 }}>
            {hasScores ? 'Based on your session scores' : 'Play songs to see your activity'}
          </Text>
          <Svg width={heatW} height={heatH}>
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
                    x={16 + fi * cellW + 1} y={18 + si * cellH}
                    width={cellW - 2} height={cellH - 2} rx={2}
                    fill={interpolateColor(v, theme.rule, theme.accent)}
                  />
                ))}
              </React.Fragment>
            ))}
          </Svg>
        </View>

        {/* Song progress list */}
        {songsStarted > 0 && (
          <View style={{ marginHorizontal: 20, marginTop: 18, padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink, marginBottom: 14 }}>Songs in progress</Text>
            {SONGS.filter((s) => (state.songProgress[s.id] ?? 0) > 0).map((s, i, arr) => {
              const prog = state.songProgress[s.id] ?? 0;
              return (
                <View key={s.id} style={{ paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: theme.rule }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, color: theme.ink, flex: 1 }}>{s.title}</Text>
                    <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.inkDim }}>{Math.round(prog * 100)}%</Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: theme.rule, borderRadius: 2, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${prog * 100}%`, backgroundColor: theme.accent }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Reset */}
        <View style={{ marginHorizontal: 20, marginTop: 18 }}>
          <TouchableOpacity
            onPress={() => dispatch({ type: 'RESET' })}
            activeOpacity={0.7}
            style={{ padding: 14, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 13, color: theme.bad }}>Reset all progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
