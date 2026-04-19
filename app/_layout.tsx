import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();
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
