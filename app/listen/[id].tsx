import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Line, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { Icon } from '../../components/Icon';
import { useApp } from '../../store/AppContext';

type Mode = 'falling' | 'waveform' | 'checklist';

const MODE_LABELS: Record<Mode, string> = {
  falling: 'Falling notes',
  waveform: 'Waveform',
  checklist: 'Beat checklist',
};

function FallingNotes({ theme, chords }: { theme: any; chords: string[] }) {
  const w = 320, h = 200;
  const notes = chords.slice(0, 4).map((c, i) => ({ x: 0.15 + i * 0.22, y: 0.1 + i * 0.2, label: c }));
  return (
    <View style={{ backgroundColor: theme.bgAlt, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width={w} height={h}>
        {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
          <Line key={i} x1={x * w} y1={0} x2={x * w} y2={h} stroke={theme.rule} strokeWidth={1} strokeDasharray="4 4" />
        ))}
        {notes.map((n, i) => (
          <React.Fragment key={i}>
            <Rect x={n.x * w - 18} y={n.y * h - 12} width={36} height={24} rx={6} fill={theme.accent} opacity={0.85 - i * 0.1} />
            <SvgText x={n.x * w} y={n.y * h + 4} textAnchor="middle" fontSize={11} fontWeight="700" fill={theme.accentInk}>{n.label}</SvgText>
          </React.Fragment>
        ))}
        <Line x1={0} y1={h - 30} x2={w} y2={h - 30} stroke={theme.accent} strokeWidth={2} opacity={0.4} />
      </Svg>
    </View>
  );
}

function WaveformView({ theme }: { theme: any }) {
  const w = 320, h = 100;
  const points = Array.from({ length: 40 }, (_, i) => ({ x: (i / 39) * w, y: h / 2 + Math.sin(i * 0.4) * 25 + Math.sin(i * 0.9) * 12 }));
  const refPoints = Array.from({ length: 40 }, (_, i) => ({ x: (i / 39) * w, y: h / 2 + Math.sin(i * 0.4) * 28 + Math.sin(i * 0.85) * 10 }));
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

function BeatChecklist({ theme, chords, score }: { theme: any; chords: string[]; score: number }) {
  // Derive pass/fail from score deterministically
  const hitRate = score / 100;
  const items = chords.flatMap((c, ci) =>
    [1, 2, 3, 4].map((beat) => {
      const seed = (ci * 4 + beat) * 0.137;
      const ok = (Math.sin(seed * 100) * 0.5 + 0.5) < hitRate;
      return { chord: c, beat, ok };
    })
  ).slice(0, 12);

  return (
    <View style={{ gap: 8 }}>
      {items.map((item, i) => (
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
  const { dispatch } = useApp();
  const song = SONGS.find((s) => s.id === id) || SONGS[0];
  const [mode, setMode] = useState<Mode>('falling');
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer if the user navigates away mid-recording
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleMicToggle = () => {
    if (listening) {
      // Stop — simulate a score
      if (timerRef.current) clearTimeout(timerRef.current);
      setListening(false);
      const simScore = Math.floor(60 + Math.random() * 35); // 60–94
      setScore(simScore);
      dispatch({ type: 'PRACTICE_SONG', songId: song.id });
      dispatch({ type: 'SET_SONG_SCORE', songId: song.id, score: simScore });
    } else {
      setListening(true);
      setScore(null);
      // Auto-stop after 30s
      timerRef.current = setTimeout(() => {
        setListening(false);
        const simScore = Math.floor(60 + Math.random() * 35);
        setScore(simScore);
        dispatch({ type: 'PRACTICE_SONG', songId: song.id });
        dispatch({ type: 'SET_SONG_SCORE', songId: song.id, score: simScore });
      }, 30000);
    }
  };

  const displayScore = score ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
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

        {/* Score — shown after recording */}
        {score !== null ? (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 100, height: 100, borderRadius: 50,
              borderWidth: 6, borderColor: displayScore >= 80 ? theme.good : displayScore >= 60 ? theme.amber : theme.bad,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: theme.surface,
            }}>
              <Text style={{ fontSize: 32, fontWeight: '700', color: theme.ink }}>{displayScore}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim }}>SCORE</Text>
            </View>
            <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 8 }}>
              {displayScore >= 80 ? 'Great playing! 🎸' : displayScore >= 60 ? 'Getting there!' : 'Keep practising!'}
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginBottom: 20, height: 120, justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, color: theme.inkDim }}>
              {listening ? 'Listening...' : 'Press record to start'}
            </Text>
            {listening && (
              <View style={{ marginTop: 12, flexDirection: 'row', gap: 4 }}>
                {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
                  <View key={i} style={{ width: 4, height: 24 * h, borderRadius: 2, backgroundColor: theme.accent }} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Visualization */}
        {mode === 'falling' && <FallingNotes theme={theme} chords={song.chords} />}
        {mode === 'waveform' && <WaveformView theme={theme} />}
        {mode === 'checklist' && score !== null && <BeatChecklist theme={theme} chords={song.chords} score={displayScore} />}
        {mode === 'checklist' && score === null && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: theme.inkDim, fontSize: 13 }}>Record a session to see your beat checklist.</Text>
          </View>
        )}
      </ScrollView>

      {/* Mic button */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: theme.rule, backgroundColor: theme.bg }}>
        <TouchableOpacity
          onPress={handleMicToggle}
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
