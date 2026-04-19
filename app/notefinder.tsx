import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import Svg, { Line, Text as SvgText, Rect, Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

const FRETBOARD_NOTES: string[][] = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
];
const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const FRETS = 12;

export default function NoteFinderScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState<{ s: number; f: number } | null>(null);
  const cellW = 28, cellH = 36;
  const svgW = 22 + cellW * FRETS;
  const svgH = cellH * 6 + 24;

  const note = selected ? FRETBOARD_NOTES[selected.s][selected.f] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>Note finder</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} horizontal>
        <View>
          {/* Note display */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: note ? `${theme.accent}20` : theme.bgAlt,
              borderWidth: 2, borderColor: note ? theme.accent : theme.rule,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 32, fontWeight: '700', color: note ? theme.accent : theme.inkMute }}>
                {note || '?'}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 8 }}>
              {selected ? `String ${STRING_NAMES[selected.s]} · Fret ${selected.f}` : 'Tap any fret'}
            </Text>
          </View>

          {/* Fretboard */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Svg width={svgW} height={svgH}>
              {/* Fret numbers */}
              {Array.from({ length: FRETS + 1 }).map((_, fi) => (
                <SvgText key={fi} x={22 + fi * cellW} y={14} textAnchor="middle" fontSize={9} fill={theme.inkMute} fontFamily="monospace">
                  {fi}
                </SvgText>
              ))}
              {/* Strings */}
              {STRING_NAMES.map((s, si) => (
                <React.Fragment key={si}>
                  <SvgText x={10} y={22 + si * cellH + cellH / 2} textAnchor="middle" fontSize={9} fill={theme.inkDim} fontFamily="monospace">{s}</SvgText>
                  <Line x1={22} y1={22 + si * cellH + cellH / 2} x2={svgW} y2={22 + si * cellH + cellH / 2} stroke={theme.inkDim} strokeWidth={si === 5 ? 2 : 1} />
                </React.Fragment>
              ))}
              {/* Fret lines */}
              {Array.from({ length: FRETS + 1 }).map((_, fi) => (
                <Line key={fi} x1={22 + fi * cellW} y1={22} x2={22 + fi * cellW} y2={22 + cellH * 6} stroke={theme.rule} strokeWidth={fi === 0 ? 3 : 1} />
              ))}
              {/* Note dots */}
              {STRING_NAMES.map((_, si) =>
                Array.from({ length: FRETS }).map((_, fi) => {
                  const cx = 22 + fi * cellW + cellW / 2;
                  const cy = 22 + si * cellH + cellH / 2;
                  const isSelected = selected?.s === si && selected?.f === fi;
                  const noteName = FRETBOARD_NOTES[si][fi];
                  const isNatural = !noteName.includes('#');
                  return (
                    <React.Fragment key={`${si}-${fi}`}>
                      <Rect
                        x={22 + fi * cellW + 2}
                        y={22 + si * cellH + 2}
                        width={cellW - 4}
                        height={cellH - 4}
                        fill="transparent"
                        onPress={() => setSelected({ s: si, f: fi })}
                      />
                      {(isNatural || isSelected) && (
                        <Circle
                          cx={cx}
                          cy={cy}
                          r={10}
                          fill={isSelected ? theme.accent : theme.bgAlt}
                          stroke={isSelected ? theme.accent : theme.rule}
                          strokeWidth={1}
                          onPress={() => setSelected({ s: si, f: fi })}
                        />
                      )}
                      {isNatural && (
                        <SvgText x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fontWeight="600" fill={isSelected ? theme.accentInk : theme.ink} fontFamily="monospace" onPress={() => setSelected({ s: si, f: fi })}>
                          {noteName}
                        </SvgText>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </Svg>
          </ScrollView>

          <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 16, textAlign: 'center' }}>
            Natural notes (A–G) shown. Tap any to reveal the name.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
