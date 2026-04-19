import { Stack, router, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../store/AppContext';

function RootNavigator() {
  const scheme = useColorScheme();
  const { state } = useApp();
  const navState = useRootNavigationState();

  useEffect(() => {
    // Wait until the navigator is mounted AND AsyncStorage has been read.
    // Without both guards: we either crash (navigator not ready) or always
    // redirect to onboarding (state not yet hydrated from storage).
    if (!navState?.key) return;
    if (!state.hydrated) return;

    if (!state.onboardingComplete) {
      router.replace('/onboarding');
    }
  }, [navState?.key, state.hydrated, state.onboardingComplete]);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="song/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="play/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="listen/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="import" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="path" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notefinder" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="melody" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="picking" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="scales" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
