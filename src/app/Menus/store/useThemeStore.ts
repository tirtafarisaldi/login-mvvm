import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

type ThemeState = {
  mode: ThemeMode;
  hasHydrated: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  onHydrate: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      hasHydrated: false,
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === 'dark' ? 'light' : 'dark',
        })),
      setMode: (mode) => set({ mode }),
      onHydrate: () => set({ hasHydrated: true }),
    }),
    {
      name: 'studio-theme',
      version: 1,
      migrate: () => ({ mode: 'dark' as ThemeMode, hasHydrated: true }),
      onRehydrateStorage: () => (state) => state?.onHydrate(),
    }
  )
);
