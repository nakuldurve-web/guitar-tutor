import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';

type Stage = 'search' | 'results' | 'preview' | 'importing' | 'done';

const MOCK_RESULTS = [
  { id: 1, source: 'TabVault', sourceColor: '#d94f3a', title: 'Monsoon Letter', artist: 'Aarav Sen', type: 'Chords', rating: 4.8, votes: 1224, verified: true, key: 'G', chords: ['G', 'Em', 'C', 'D'], badge: undefined },
  { id: 2, source: 'Chordly', sourceColor: '#4a90e2', title: 'Monsoon Letter (acoustic)', artist: 'Aarav Sen', type: 'Chords + tab', rating: 4.6, votes: 412, verified: false, key: 'G', chords: ['G', 'Em', 'C', 'D'], badge: undefined },
  { id: 3, source: 'FretNotes', sourceColor: '#6b9e7f', title: 'Monsoon Letter', artist: 'Aarav Sen', type: 'Full tab', rating: 4.4, votes: 88, verified: false, key: 'G', chords: ['G', 'Em', 'C', 'D'], badge: undefined },
  { id: 4, source: 'TabVault', sourceColor: '#d94f3a', title: 'Monsoon Letter (simplified)', artist: 'Aarav Sen', type: 'Chords', rating: 4.9, votes: 301, verified: true, key: 'G', chords: ['G', 'C', 'D'], badge: 'Beginner friendly' },
];

const SOURCES = ['TabVault', 'Chordly', 'FretNotes', 'GuitarPro', 'ChordU', 'UltGuitar'];

export default function ImportScreen() {
  const theme = useTheme();
  const [stage, setStage] = useState<Stage>('search');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<typeof MOCK_RESULTS[0] | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'importing') return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setStage('done'); return 100; }
        return p + 8;
      });
    }, 180);
    return () => clearInterval(id);
  }, [stage]);

  const title = {
    search: 'Find tabs online',
    results: 'Pick a source',
    preview: 'Review & import',
    importing: 'Importing…',
    done: 'Added to library!',
  }[stage];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.rule, gap: 12 }}>
        <TouchableOpacity
          onPress={() => {
            if (stage === 'preview') setStage('results');
            else if (stage === 'results') setStage('search');
            else router.back();
          }}
          activeOpacity={0.7}
          style={{ padding: 4 }}
        >
          <Icon name="back" size={20} color={theme.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Add a song</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink }}>{title}</Text>
        </View>
      </View>

      {/* SEARCH */}
      {stage === 'search' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: theme.surface, borderWidth: 1.5, borderColor: theme.accent, borderRadius: 12 }}>
            <Icon name="search" size={18} color={theme.accent} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search song or artist…"
              placeholderTextColor={theme.inkDim}
              style={{ flex: 1, color: theme.ink, fontSize: 15 }}
              returnKeyType="search"
              onSubmitEditing={() => query.trim() && setStage('results')}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Icon name="x" size={14} color={theme.inkDim} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 8, fontFamily: 'monospace' }}>
            Song title, artist, or paste a tab URL
          </Text>

          {/* Paste URL */}
          <View style={{ marginTop: 20, padding: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderStyle: 'dashed', borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="import" size={20} color={theme.inkDim} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: theme.ink }}>Have a link?</Text>
              <Text style={{ fontSize: 11, color: theme.inkDim }}>Paste any tab URL — we'll parse the chords</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: theme.ink, borderRadius: 100 }}>
              <Text style={{ fontSize: 11, fontWeight: '500', color: theme.bg }}>Paste</Text>
            </TouchableOpacity>
          </View>

          {/* Connected sources */}
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 28, marginBottom: 12 }}>
            Sources · {SOURCES.length} connected
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SOURCES.map((s) => (
              <View key={s} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: theme.inkDim }}>{s}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => { if (query.trim()) setStage('results'); }}
            activeOpacity={0.85}
            style={{ marginTop: 32, paddingVertical: 16, backgroundColor: theme.accent, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: theme.accentInk }}>Search</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* RESULTS */}
      {stage === 'results' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 13, color: theme.inkDim, marginBottom: 4 }}>
            {MOCK_RESULTS.length} results for "{query || 'Monsoon Letter'}"
          </Text>
          {MOCK_RESULTS.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => { setPicked(r); setStage('preview'); }}
              activeOpacity={0.8}
              style={{ padding: 14, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: r.sourceColor, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>{r.source}</Text>
                    </View>
                    {r.verified && <Icon name="check" size={14} color={theme.good} />}
                    {r.badge && (
                      <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: `${theme.good}20`, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, color: theme.good, fontWeight: '500' }}>{r.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: theme.ink }}>{r.title}</Text>
                  <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 1 }}>{r.type} · Key of {r.key}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    {r.chords.map((c) => (
                      <View key={c} style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: theme.bgAlt, borderRadius: 4 }}>
                        <Text style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: '600', color: theme.ink }}>{c}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Icon name="star" size={14} color={theme.amber} />
                  <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.ink, fontWeight: '600', marginTop: 2 }}>{r.rating}</Text>
                  <Text style={{ fontSize: 10, color: theme.inkDim }}>{r.votes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* PREVIEW */}
      {stage === 'preview' && picked && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <View style={{ padding: 16, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.rule, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink }}>{picked.title}</Text>
            <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 2 }}>{picked.artist} · {picked.source}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              {picked.chords.map((c) => (
                <View key={c} style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: theme.bgAlt, borderRadius: 6 }}>
                  <Text style={{ fontFamily: 'monospace', fontWeight: '600', color: theme.ink }}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={{ fontSize: 12, color: theme.inkDim, marginBottom: 20, lineHeight: 18 }}>
            Tabs are sourced from community contributors. Accuracy may vary. Always verify chords against the original recording.
          </Text>
          <TouchableOpacity
            onPress={() => setStage('importing')}
            activeOpacity={0.85}
            style={{ paddingVertical: 16, backgroundColor: theme.accent, borderRadius: 12, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: theme.accentInk }}>Import to library</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* IMPORTING */}
      {stage === 'importing' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <Text style={{ fontSize: 40, marginBottom: 20 }}>🎸</Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: theme.ink, marginBottom: 8 }}>Importing…</Text>
          <View style={{ width: '100%', height: 4, backgroundColor: theme.rule, borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
            <View style={{ height: '100%', width: `${progress}%`, backgroundColor: theme.accent }} />
          </View>
          <Text style={{ fontFamily: 'monospace', fontSize: 12, color: theme.inkDim, marginTop: 8 }}>{progress}%</Text>
        </View>
      )}

      {/* DONE */}
      {stage === 'done' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${theme.good}20`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name="check" size={40} color={theme.good} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '500', color: theme.ink, marginBottom: 8 }}>Added to library!</Text>
          <Text style={{ fontSize: 14, color: theme.inkDim, textAlign: 'center', marginBottom: 32 }}>
            {picked?.title} is now in your library. Start learning!
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            style={{ paddingHorizontal: 32, paddingVertical: 14, backgroundColor: theme.accent, borderRadius: 12 }}
          >
            <Text style={{ fontWeight: '600', fontSize: 15, color: theme.accentInk }}>Go to library</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
