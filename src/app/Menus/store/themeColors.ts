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
  pageBg: 'rgba(11, 15, 24, 0.96)',
  pageBgImage:
    'linear-gradient(135deg, rgba(32, 42, 58, 0.82), rgba(59, 78, 103, 0.72) 42%, rgba(20, 27, 38, 0.88))',
  panelBg: 'rgba(15, 23, 42, 0.75)',
  panelBorder: 'rgba(148, 163, 184, 0.16)',
  panelShadow:
    '0 26px 60px rgba(2,6,12,0.28), 0 10px 22px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(148,163,184,0.05)',
  cardBg: 'rgba(17, 24, 39, 0.8)',
  cardBorder: 'rgba(148, 163, 184, 0.16)',
  inputBg: 'whiteAlpha.100',
  inputBorder: 'whiteAlpha.300',
  textPrimary: 'white',
  textSecondary: 'rgb(226, 232, 240)',
  textMuted: 'rgb(186, 198, 218)',
  surfaceStrong: 'rgba(15, 23, 42, 0.82)',
  overlayBg: 'rgba(15, 23, 42, 0.58)',
  chipBg: 'rgba(148, 163, 184, 0.12)',
  todayChipBg: 'blue.600',
  hoverBg: 'rgba(148, 163, 184, 0.08)',
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
