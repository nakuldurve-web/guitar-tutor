import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { SongRow } from '../../components/SongRow';
import { Icon } from '../../components/Icon';

const GENRES = ['All', 'Bollywood', 'Classic Rock', 'Folk Rock', 'Rock', 'Pop', 'Country / Folk', 'Alternative Rock', 'Indie Folk', 'Southern Rock'];

export default function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');

  const filtered = SONGS.filter((s) => {
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      s.chords.some((c) => c.toLowerCase().includes(query.toLowerCase()));
    const matchesGenre = genre === 'All' || s.genre === genre;
    return matchesQuery && matchesGenre;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: 20, paddingBottom: 4 }}>
        <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5, marginBottom: 12 }}>Search</Text>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          padding: 12, backgroundColor: theme.surface,
          borderWidth: 1.5, borderColor: query ? theme.accent : theme.rule, borderRadius: 10,
        }}>
          <Icon name="search" size={18} color={query ? theme.accent : theme.inkDim} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Songs, artists, chords…"
            placeholderTextColor={theme.inkDim}
            style={{ flex: 1, color: theme.ink, fontSize: 15 }}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <Icon name="x" size={16} color={theme.inkDim} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6, paddingVertical: 10 }}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGenre(g)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
              borderWidth: 1,
              borderColor: genre === g ? theme.ink : theme.rule,
              backgroundColor: genre === g ? theme.ink : 'transparent',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: genre === g ? theme.bg : theme.ink }}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🎸</Text>
            <Text style={{ fontSize: 16, fontWeight: '500', color: theme.ink }}>No songs found</Text>
            <Text style={{ fontSize: 13, color: theme.inkDim, marginTop: 4 }}>Try a different search</Text>
          </View>
        ) : (
          filtered.map((s) => (
            <SongRow
              key={s.id}
              song={s}
              theme={theme}
              onPress={() => router.push(`/song/${s.id}`)}
            />
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
