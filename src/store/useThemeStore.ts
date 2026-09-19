import { create } from 'zustand';
import { storage } from '@/utils/storage';

const THEME_KEY = '@gallery_app/theme';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  statusBar: 'light' | 'dark';
}

const lightColors: ThemeColors = {
  background: '#F9FAFB',
  surface: '#fff',
  card: '#fff',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#3B82F6',
  statusBar: 'dark',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#60A5FA',
  statusBar: 'light',
};

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  isHydrated: boolean;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  colors: lightColors,
  isHydrated: false,

  loadTheme: async () => {
    const saved = await storage.getItem<ThemeMode>(THEME_KEY);
    const mode = saved ?? 'light';
    set({ mode, colors: mode === 'dark' ? darkColors : lightColors, isHydrated: true });
  },

  toggleTheme: async () => {
    const nextMode: ThemeMode = get().mode === 'light' ? 'dark' : 'light';
    await storage.setItem(THEME_KEY, nextMode);
    set({ mode: nextMode, colors: nextMode === 'dark' ? darkColors : lightColors });
  },
}));