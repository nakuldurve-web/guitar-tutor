import { File, Paths } from 'expo-file-system';
import { Audio } from 'expo-av';

// Standard tuning open-string frequencies (Hz)
const OPEN_STRING_FREQ = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]; // E2 A2 D3 G3 B3 e4

export function fretToFrequency(stringIndex: number, fret: number): number {
  // stringIndex 0=low E, 5=high e
  return OPEN_STRING_FREQ[stringIndex] * Math.pow(2, fret / 12);
}

// Build a 16-bit PCM WAV as Uint8Array
function buildWav(samples: Float32Array, sampleRate: number): Uint8Array {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);

  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, Math.round(clamped * 32767), true);
  }

  return new Uint8Array(buf);
}

// Synthesise a plucked string tone (Karplus-Strong approximation via additive)
function synthNote(freq: number, durationSec: number, sampleRate = 22050): Float32Array {
  const n = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(n);
  const decay = Math.exp(-3 / (freq * durationSec)); // faster decay for higher notes

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * (2.5 + freq * 0.004));
    // Fundamental + 2 harmonics with slight detuning for warmth
    const v =
      Math.sin(2 * Math.PI * freq * t) * 0.5 +
      Math.sin(2 * Math.PI * freq * 2 * t) * 0.25 +
      Math.sin(2 * Math.PI * freq * 3 * t) * 0.12 +
      Math.sin(2 * Math.PI * freq * 4 * t) * 0.06;
    samples[i] = v * env * 0.7;
  }
  return samples;
}

// Merge multiple mono sample arrays into one (for chords)
function mixSamples(tracks: Float32Array[]): Float32Array {
  const len = Math.max(...tracks.map((t) => t.length));
  const out = new Float32Array(len);
  const gain = 1 / Math.sqrt(tracks.length);
  for (const track of tracks) {
    for (let i = 0; i < track.length; i++) out[i] += track[i] * gain;
  }
  return out;
}

let currentSound: Audio.Sound | null = null;

async function writeAndPlay(samples: Float32Array, sampleRate = 22050) {
  if (currentSound) {
    await currentSound.stopAsync().catch(() => {});
    await currentSound.unloadAsync().catch(() => {});
    currentSound = null;
  }

  const bytes = buildWav(samples, sampleRate);
  const file = new File(Paths.cache, 'note.wav');
  file.write(bytes);

  const { sound } = await Audio.Sound.createAsync({ uri: file.uri });
  currentSound = sound;
  await sound.playAsync();
}

export async function playNote(stringIndex: number, fret: number) {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const freq = fretToFrequency(stringIndex, fret);
  const samples = synthNote(freq, 1.5);
  await writeAndPlay(samples);
}

export async function playChord(chordFrets: number[]) {
  // chordFrets: array of 6 frets [string0..string5], -1 = muted
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const tracks: Float32Array[] = [];
  for (let si = 0; si < 6; si++) {
    const fret = chordFrets[si];
    if (fret < 0) continue;
    const freq = fretToFrequency(si, fret);
    tracks.push(synthNote(freq, 1.8));
  }
  if (tracks.length === 0) return;
  const mixed = mixSamples(tracks);
  await writeAndPlay(mixed);
}

export async function playTabSequence(
  notes: { stringIndex: number; fret: number }[],
  bpm: number,
  onNoteIndex?: (i: number) => void
) {
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const sampleRate = 22050;
  const beatSec = 60 / bpm;
  const noteDur = beatSec * 0.9;

  // Build full sequence as one buffer
  const totalSec = notes.length * beatSec + 0.5;
  const totalSamples = Math.floor(totalSec * sampleRate);
  const out = new Float32Array(totalSamples);

  for (let i = 0; i < notes.length; i++) {
    const { stringIndex, fret } = notes[i];
    if (fret < 0) continue;
    const freq = fretToFrequency(stringIndex, fret);
    const note = synthNote(freq, noteDur, sampleRate);
    const offset = Math.floor(i * beatSec * sampleRate);
    for (let j = 0; j < note.length && offset + j < totalSamples; j++) {
      out[offset + j] += note[j] * 0.7;
    }
  }

  // Normalise
  const peak = Math.max(...out.map(Math.abs));
  if (peak > 0.95) for (let i = 0; i < out.length; i++) out[i] = (out[i] / peak) * 0.95;

  await writeAndPlay(out, sampleRate);
}
