import { useThemeStore, type ThemeMode } from '../store/useThemeStore';

export interface ThemeColors {
  pageBg: string;
  pageBgImage: string;
  panelBg: string;
  panelBorder: string;
  panelShadow: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  surfaceStrong: string;
  overlayBg: string;
  chipBg: string;
  todayChipBg: string;
  hoverBg: string;
}

const dark: ThemeColors = {
  pageBg: 'rgba(25, 27, 32, 0.85)',
  pageBgImage: 'none',
  panelBg: 'rgba(0,0,0,0.30)',
  panelBorder: 'rgba(255,255,255,0.12)',
  panelShadow:
    '0 30px 60px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.05)',
  cardBg: 'rgba(0,0,0,0.55)',
  cardBorder: 'rgba(255,255,255,0.08)',
  inputBg: 'whiteAlpha.100',
  inputBorder: 'whiteAlpha.300',
  textPrimary: 'white',
  textSecondary: 'whiteAlpha.700',
  textMuted: 'whiteAlpha.500',
  surfaceStrong: 'rgba(0,0,0,0.50)',
  overlayBg: 'rgba(0,0,0,0.60)',
  chipBg: 'rgba(255,255,255,0.14)',
  todayChipBg: 'blue.600',
  hoverBg: 'rgba(255,255,255,0.07)',
};

const light: ThemeColors = {
  pageBg: 'rgba(15,23,42,0.06)',
  pageBgImage: 'none',
  panelBg: 'rgba(255,255,255,0.72)',
  panelBorder: 'rgba(15,23,42,0.10)',
  panelShadow:
    '0 24px 50px rgba(15,23,42,0.18), 0 6px 16px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(15,23,42,0.04)',
  cardBg: 'rgba(255,255,255,0.92)',
  cardBorder: 'rgba(15,23,42,0.10)',
  inputBg: 'white',
  inputBorder: 'gray.300',
  textPrimary: 'gray.900',
  textSecondary: 'gray.600',
  textMuted: 'gray.500',
  surfaceStrong: 'rgba(255,255,255,0.95)',
  overlayBg: 'rgba(15,23,42,0.30)',
  chipBg: 'rgba(15,23,42,0.06)',
  todayChipBg: 'blue.600',
  hoverBg: 'rgba(15,23,42,0.05)',
};

export const themePalettes: Record<ThemeMode, ThemeColors> = { dark, light };

export function useThemeColors(): ThemeColors {
  const mode = useThemeStore((state) => state.mode);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  return themePalettes[hasHydrated ? mode : 'dark'];
}
