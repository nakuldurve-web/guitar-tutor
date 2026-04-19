import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Generates a short sine-wave click at given frequency using raw PCM WAV
function makeClickWav(freq = 880, durationMs = 40, sampleRate = 22050): string {
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);   // PCM
  view.setUint16(22, 1, true);   // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 80);
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope;
    view.setInt16(44 + i * 2, Math.round(sample * 32767 * 0.7), true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
}

export function useMetronome(bpm: number, playing: boolean, onBeat?: (beat: number) => void) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const beatRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const uri = makeClickWav(880, 30);
    Audio.Sound.createAsync({ uri }).then(({ sound }) => {
      soundRef.current = sound;
    });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!playing) return;

    const beatMs = (60 / bpm) * 1000;
    intervalRef.current = setInterval(async () => {
      const beat = beatRef.current % 4;
      beatRef.current++;
      onBeat?.(beat);
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    }, beatMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, bpm]);
}
