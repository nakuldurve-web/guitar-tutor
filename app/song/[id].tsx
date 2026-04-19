import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS, CHORD_SHAPES } from '../../constants/songs';
import { CHORD_COLORS } from '../../constants/theme';
import { CoverArt } from '../../components/CoverArt';
import { ChordDiagram } from '../../components/ChordDiagram';
import { Icon } from '../../components/Icon';
import { DifficultyDots } from '../../components/DifficultyDots';
import { playChord } from '../../utils/audioEngine';
import { useApp } from '../../store/AppContext';
import Svg, { Line, Text as SvgText, Rect } from 'react-native-svg';

type TabStyle = 'diagram' | 'tab' | 'card' | 'hand';

function TabStylePicker({ value, onChange, theme }: { value: TabStyle; onChange: (v: TabStyle) => void; theme: any }) {
  const options: { id: TabStyle; label: string }[] = [
    { id: 'diagram', label: 'Diagram' },
    { id: 'tab', label: 'Tab' },
    { id: 'card', label: 'Cards' },
    { id: 'hand', label: 'Hand' },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingHorizontal: 20, paddingVertical: 8 }}>
      {options.map((o) => (
        <TouchableOpacity
          key={o.id}
          onPress={() => onChange(o.id)}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 12, paddingVertical: 5,
            borderRadius: 100, borderWidth: 1,
            borderColor: value === o.id ? theme.accent : theme.rule,
            backgroundColor: value === o.id ? `${theme.accent}15` : 'transparent',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '500', color: value === o.id ? theme.accent : theme.ink }}>
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ChordCard({ name, active = false }: { name: string; active?: boolean }) {
  const color = CHORD_COLORS[name] || '#888';
  return (
    <View style={{
      width: 52, height: 60, borderRadius: 8,
      backgroundColor: color,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: active ? 3 : 0, borderColor: '#fff',
    }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#fff', lineHeight: 24 }}>{name[0]}</Text>
      {name.length > 1 && (
        <Text style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: '500', color: 'rgba(255,255,255,0.85)', letterSpacing: 1, marginTop: 2 }}>
          {name.slice(1).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function TabStaff({ theme }: { theme: any }) {
  const w = 280, stringGap = 10;
  const h = stringGap * 5 + 24;
  const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
  const sample = ['3', '', '', '0', '2', '', '3', '', '', '2', '', '0', '', '3', '', ''];
  return (
    <Svg width={w} height={h}>
      {strings.map((s, i) => (
        <React.Fragment key={s}>
          <SvgText x={4} y={12 + i * stringGap + 3} fontSize={8} fill={theme.inkDim} fontFamily="monospace">{s}</SvgText>
          <Line x1={16} y1={12 + i * stringGap} x2={w - 4} y2={12 + i * stringGap} stroke={theme.rule} strokeWidth={0.8} />
        </React.Fragment>
      ))}
      {sample.map((n, i) => {
        if (!n) return null;
        const si = i % 6;
        const x = 20 + i * 16;
        const y = 12 + si * stringGap;
        return (
          <React.Fragment key={i}>
            <Rect x={x - 5} y={y - 5} width={10} height={10} fill={theme.bg} />
            <SvgText x={x} y={y + 3} textAnchor="middle" fontSize={8} fontWeight="600" fill={theme.ink} fontFamily="monospace">{n}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { state } = useApp();
  const [tabStyle, setTabStyle] = useState<TabStyle>('diagram');
  const [liked, setLiked] = useState(false);

  const song = SONGS.find((s) => s.id === id) || SONGS[0];
  const songProgress = state.songProgress[song.id] ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Hero */}
      <View style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
        <CoverArt song={song} size={Dimensions.get('window').width} rounded={0} />
        {/* Bottom fade so hero blends into content */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: theme.bg, opacity: 0.55 }} />
        {/* Back & actions */}
        <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="back" size={18} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setLiked(!liked)}
              activeOpacity={0.8}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name={liked ? 'heart-fill' : 'heart'} size={18} color={liked ? theme.accent : '#1a1a1a'} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="more" size={18} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Song info */}
        <View style={{ padding: 20, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5 }}>{song.title}</Text>
          <Text style={{ fontSize: 14, color: theme.inkDim, marginTop: 4 }}>{song.artist} · {song.album}</Text>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name="metronome" size={14} color={theme.inkDim} />
              <Text style={{ fontSize: 12, color: theme.inkDim, fontFamily: 'monospace' }}>{song.bpm} BPM</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={{ fontSize: 12, color: theme.inkDim, fontFamily: 'monospace' }}>Key: {song.key}</Text>
            </View>
            <DifficultyDots n={song.difficultyDots} theme={theme} />
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: theme.inkDim }}>Strum:</Text>
            <Text style={{ fontSize: 13, fontFamily: 'monospace', color: theme.accent, fontWeight: '500' }}>{song.strum}</Text>
          </View>
        </View>

        {/* Tab style picker */}
        <TabStylePicker value={tabStyle} onChange={setTabStyle} theme={theme} />

        {/* Chords section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Chords used
          </Text>
        </View>

        {tabStyle === 'diagram' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingVertical: 12 }}>
            {song.chords.map((c) => (
              <TouchableOpacity key={c} onPress={() => { const s = CHORD_SHAPES[c]; if (s) playChord(s.frets); }} activeOpacity={0.7} style={{ alignItems: 'center' }}>
                <ChordDiagram name={c} size={1.2} theme={theme} showName />
                <Text style={{ fontSize: 9, color: theme.inkMute, fontFamily: 'monospace', marginTop: 2 }}>TAP TO HEAR</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {tabStyle === 'card' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
            {song.chords.map((c) => <ChordCard key={c} name={c} />)}
          </ScrollView>
        )}

        {tabStyle === 'tab' && (
          <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <TabStaff theme={theme} />
          </View>
        )}

        {tabStyle === 'hand' && (
          <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <Text style={{ fontSize: 13, color: theme.inkDim }}>Hand position view — shows finger placement on fretboard</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>
              {song.chords.map((c) => (
                <View key={c} style={{ padding: 12, backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.rule, alignItems: 'center', minWidth: 100 }}>
                  <View style={{ width: 80, height: 50, backgroundColor: theme.bgAlt, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'monospace', fontSize: 10, color: theme.inkDim }}>HAND POS</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.ink, marginTop: 6 }}>{c}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Progress */}
        {songProgress > 0 && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: theme.inkDim }}>Your progress</Text>
              <Text style={{ fontSize: 12, fontFamily: 'monospace', color: theme.inkDim }}>{Math.round(songProgress * 100)}%</Text>
            </View>
            <View style={{ height: 4, backgroundColor: theme.rule, borderRadius: 2, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${songProgress * 100}%`, backgroundColor: theme.accent }} />
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push(`/play/${song.id}`)}
            activeOpacity={0.85}
            style={{ paddingVertical: 16, backgroundColor: theme.accent, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
          >
            <Icon name="play" size={18} color={theme.accentInk} />
            <Text style={{ color: theme.accentInk, fontWeight: '600', fontSize: 16 }}>Play along</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/listen/${song.id}`)}
            activeOpacity={0.85}
            style={{ paddingVertical: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
          >
            <Icon name="mic" size={18} color={theme.ink} />
            <Text style={{ color: theme.ink, fontWeight: '600', fontSize: 16 }}>Listen & grade</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
