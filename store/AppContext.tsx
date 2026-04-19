import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@guitartutor/state/v1';
const TODAY = () => new Date().toISOString().slice(0, 10);

export interface AppState {
  hydrated: boolean;                       // true once AsyncStorage has been read
  userName: string;
  skillLevel: string;
  onboardingComplete: boolean;
  songProgress: Record<string, number>;   // 0–1 per song ID
  songSessions: Record<string, number>;   // play count per song ID
  songScores: Record<string, number>;     // best listen score 0–100
  practiceHistory: string[];              // unique YYYY-MM-DD dates
  recentSongIds: string[];                // last played, newest first
  pathProgress: string[];                 // completed path step IDs
}

const INITIAL_STATE: AppState = {
  hydrated: false,
  userName: '',
  skillLevel: '',
  onboardingComplete: false,
  songProgress: {},
  songSessions: {},
  songScores: {},
  practiceHistory: [],
  recentSongIds: [],
  pathProgress: [],
};

type Action =
  | { type: 'HYDRATE'; payload: Omit<AppState, 'hydrated'> }
  | { type: 'SET_HYDRATED' }
  | { type: 'COMPLETE_ONBOARDING'; name: string; skillLevel: string }
  | { type: 'PRACTICE_SONG'; songId: string }
  | { type: 'SET_SONG_SCORE'; songId: string; score: number }
  | { type: 'COMPLETE_PATH_STEP'; stepId: string }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...action.payload, hydrated: true };

    case 'SET_HYDRATED':
      return { ...state, hydrated: true };

    case 'COMPLETE_ONBOARDING':
      return { ...state, userName: action.name, skillLevel: action.skillLevel, onboardingComplete: true };

    case 'PRACTICE_SONG': {
      const { songId } = action;
      const today = TODAY();
      const prevProgress = state.songProgress[songId] ?? 0;
      const prevSessions = state.songSessions[songId] ?? 0;
      const newProgress = Math.min(0.9, prevProgress + (prevProgress === 0 ? 0.1 : 0.15));
      const newSessions = prevSessions + 1;
      const recentSongIds = [songId, ...state.recentSongIds.filter((id) => id !== songId)].slice(0, 10);
      const practiceHistory = state.practiceHistory.includes(today)
        ? state.practiceHistory
        : [...state.practiceHistory, today];
      return {
        ...state,
        songProgress: { ...state.songProgress, [songId]: newProgress },
        songSessions: { ...state.songSessions, [songId]: newSessions },
        recentSongIds,
        practiceHistory,
      };
    }

    case 'SET_SONG_SCORE': {
      const prev = state.songScores[action.songId] ?? 0;
      const best = Math.max(prev, action.score);
      const progress = best >= 90
        ? 1.0
        : Math.max(state.songProgress[action.songId] ?? 0, best / 100);
      return {
        ...state,
        songScores: { ...state.songScores, [action.songId]: best },
        songProgress: { ...state.songProgress, [action.songId]: progress },
      };
    }

    case 'COMPLETE_PATH_STEP':
      if (state.pathProgress.includes(action.stepId)) return state;
      return { ...state, pathProgress: [...state.pathProgress, action.stepId] };

    case 'RESET':
      return { ...INITIAL_STATE, hydrated: true };

    default:
      return state;
  }
}

export function calcStreak(history: string[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort().reverse();
  const today = TODAY();
  let streak = 0;
  let current = today;
  for (const date of sorted) {
    if (date === current) {
      streak++;
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      current = d.toISOString().slice(0, 10);
    } else if (date < current) {
      break;
    }
  }
  return streak;
}

export function calcAvgScore(scores: Record<string, number>): number {
  const vals = Object.values(scores);
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Hydrate from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            dispatch({ type: 'HYDRATE', payload: parsed });
          } catch {
            dispatch({ type: 'SET_HYDRATED' });
          }
        } else {
          dispatch({ type: 'SET_HYDRATED' });
        }
      })
      .catch(() => {
        // AsyncStorage unavailable — run without persistence
        dispatch({ type: 'SET_HYDRATED' });
      });
  }, []);

  // Persist on every change, but only after hydration
  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
