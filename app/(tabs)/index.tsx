import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { SONGS } from '../../constants/songs';
import { CoverArt } from '../../components/CoverArt';
import { SongRow } from '../../components/SongRow';
import { Icon } from '../../components/Icon';

function Mascot({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.15,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="guitar" size={size * 0.55} color={color} />
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const featured = SONGS[0];
  const recent = SONGS.slice(1, 4);
  const beginnerPicks = SONGS.slice(3, 7);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ padding: 20, paddingBottom: 12 }}>
          <Text style={{ fontSize: 11, color: theme.inkDim, fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={{ fontSize: 26, fontWeight: '500', color: theme.ink, marginTop: 4, letterSpacing: -0.5 }}>
            {"Let's practice, "}
            <Text style={{ fontStyle: 'italic', color: theme.accent }}>Priya</Text>
          </Text>
        </View>

        {/* Streak + Tune strip */}
        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 20 }}>
          <View style={{
            flex: 1, padding: 14, backgroundColor: theme.surface,
            borderWidth: 1, borderColor: theme.rule, borderRadius: 10,
            flexDirection: 'row', alignItems: 'center', gap: 10,
          }}>
            <Mascot color={theme.accent} size={36} />
            <View>
              <Text style={{ fontSize: 20, fontWeight: '600', color: theme.ink }}>
                12 <Text style={{ fontSize: 11, fontFamily: 'monospace', color: theme.inkDim, fontWeight: '400' }}>DAYS</Text>
              </Text>
              <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 2 }}>Streak alive ✦</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/onboarding')}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 16, paddingVertical: 14,
              backgroundColor: theme.accent, borderRadius: 10,
              flexDirection: 'row', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="tuning" size={18} strokeWidth={2} color={theme.accentInk} />
            <Text style={{ color: theme.accentInk, fontWeight: '500', fontSize: 13 }}>Tune</Text>
          </TouchableOpacity>
        </View>

        {/* Featured "continue" card */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Continue learning
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/song/${featured.id}`)}
            activeOpacity={0.85}
            style={{
              borderRadius: 14, overflow: 'hidden',
              backgroundColor: featured.gradient[0],
              shadowColor: featured.color,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View style={{ padding: 18, paddingBottom: 16 }}>
              <Text style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                LESSON 3 · VERSE
              </Text>
              <Text style={{ fontSize: 26, fontWeight: '500', color: '#fff', marginTop: 4, letterSpacing: -0.5, lineHeight: 30 }}>
                {featured.title}
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{featured.artist}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'center' }}>
                {featured.chords.map((c) => (
                  <View key={c} style={{ paddingHorizontal: 9, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 4 }}>
                    <Text style={{ fontWeight: '600', fontSize: 13, color: '#fff' }}>{c}</Text>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${featured.progress * 100}%`, backgroundColor: '#fff' }} />
                </View>
                <Text style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                  {Math.round(featured.progress * 100)}%
                </Text>
              </View>
            </View>
            {/* Play button */}
            <View style={{
              position: 'absolute', right: 14, top: 14,
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="play" size={18} color={featured.color} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Beginner path prompt */}
        <TouchableOpacity
          onPress={() => router.push('/path')}
          activeOpacity={0.8}
          style={{
            marginHorizontal: 20, marginBottom: 24,
            padding: 16, backgroundColor: theme.surface,
            borderWidth: 1, borderColor: theme.accent,
            borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
          }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${theme.accent}20`, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="guitar" size={22} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink }}>New to guitar?</Text>
            <Text style={{ fontSize: 12, color: theme.inkDim, marginTop: 1 }}>Start with single strings & notes</Text>
          </View>
          <Icon name="chevron-right" size={18} color={theme.inkDim} />
        </TouchableOpacity>

        {/* Recently practiced */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Recently practiced</Text>
          <Text style={{ fontSize: 11, color: theme.accent, fontWeight: '500' }}>See all</Text>
        </View>
        {recent.map((s) => (
          <SongRow key={s.id} song={s} theme={theme} onPress={() => router.push(`/song/${s.id}`)} showProgress />
        ))}

        {/* Easy for beginners */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, fontFamily: 'monospace', color: theme.inkDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>Easy for beginners</Text>
          <Text style={{ fontSize: 11, color: theme.accent, fontWeight: '500' }}>Browse</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {beginnerPicks.map((s) => (
            <TouchableOpacity key={s.id} onPress={() => router.push(`/song/${s.id}`)} activeOpacity={0.8} style={{ width: 136 }}>
              <CoverArt song={s} size={136} rounded={10} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.ink, marginTop: 8, lineHeight: 18 }} numberOfLines={2}>{s.title}</Text>
              <Text style={{ fontSize: 11, color: theme.inkDim, marginTop: 1 }}>{s.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Drill prompt */}
        <View style={{ marginHorizontal: 20, marginTop: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/drills')}
            activeOpacity={0.8}
            style={{
              padding: 16, backgroundColor: theme.surface,
              borderWidth: 1, borderColor: theme.rule, borderRadius: 12,
              flexDirection: 'row', alignItems: 'center', gap: 10,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: theme.bgAlt, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="drill" size={22} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '500', color: theme.ink }}>G → C → D drill</Text>
              <Text style={{ fontSize: 11, color: theme.inkDim }}>3 min · transitions</Text>
            </View>
            <Icon name="chevron-right" size={18} color={theme.inkDim} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Import FAB */}
      <TouchableOpacity
        onPress={() => router.push('/import')}
        activeOpacity={0.85}
        style={{
          position: 'absolute', right: 20, bottom: 20,
          width: 52, height: 52, borderRadius: 26,
          backgroundColor: theme.ink,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25, shadowRadius: 8, elevation: 6,
        }}
      >
        <Icon name="plus" size={22} color={theme.bg} strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
