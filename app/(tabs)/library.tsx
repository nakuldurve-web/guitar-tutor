import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { SongRow } from '../../components/SongRow';
import { Icon } from '../../components/Icon';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'learning', label: 'Learning' },
  { id: 'saved', label: 'Saved' },
  { id: 'mastered', label: 'Mastered' },
];

export default function LibraryScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  const songs = activeTab === 'learning'
    ? SONGS.filter((s) => s.progress > 0 && s.progress < 1)
    : activeTab === 'mastered'
    ? SONGS.filter((s) => s.progress >= 1)
    : SONGS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: 20, paddingBottom: 4 }}>
        <Text style={{ fontSize: 28, fontWeight: '500', color: theme.ink, letterSpacing: -0.5 }}>Library</Text>
        <TouchableOpacity
          onPress={() => router.push('/search')}
          activeOpacity={0.7}
          style={{
            marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
            padding: 12, backgroundColor: theme.surface,
            borderWidth: 1, borderColor: theme.rule, borderRadius: 10,
          }}
        >
          <Icon name="search" size={18} color={theme.inkDim} />
          <Text style={{ fontSize: 14, color: theme.inkDim }}>Search songs, artists, chords</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, gap: 8 }}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setActiveTab(t.id)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 14, paddingVertical: 6,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: activeTab === t.id ? theme.ink : theme.rule,
              backgroundColor: activeTab === t.id ? theme.ink : 'transparent',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: activeTab === t.id ? theme.bg : theme.ink }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {songs.map((s) => (
          <SongRow
            key={s.id}
            song={s}
            theme={theme}
            onPress={() => router.push(`/song/${s.id}`)}
            showProgress
          />
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Import FAB */}
      <TouchableOpacity
        onPress={() => router.push('/import')}
        activeOpacity={0.85}
        style={{
          position: 'absolute', right: 20, bottom: 20,
          flexDirection: 'row', alignItems: 'center', gap: 8,
          paddingHorizontal: 16, paddingVertical: 12,
          backgroundColor: theme.ink, borderRadius: 100,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
        }}
      >
        <Icon name="plus" size={18} color={theme.bg} strokeWidth={2} />
        <Text style={{ color: theme.bg, fontWeight: '500', fontSize: 13 }}>Add song</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
