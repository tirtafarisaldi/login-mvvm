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
  pageBg: '#060a14',
  pageBgImage:
    'radial-gradient(ellipse 55% 40% at 12% -10%, rgba(99,102,241,0.32), transparent 60%), radial-gradient(ellipse 45% 35% at 100% -5%, rgba(34,211,238,0.26), transparent 55%), radial-gradient(ellipse 60% 45% at 88% 108%, rgba(168,85,247,0.24), transparent 60%), radial-gradient(ellipse 50% 40% at -5% 100%, rgba(59,130,246,0.24), transparent 55%), linear-gradient(180deg, #0b1121 0%, #0a0f1e 50%, #070b15 100%)',
  panelBg: 'rgba(0,0,0,0.30)',
  panelBorder: 'rgba(255,255,255,0.12)',
  panelShadow:
    '0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.04)',
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
  pageBg: '#eef2f7',
  pageBgImage: 'none',
  panelBg: 'rgba(255,255,255,0.72)',
  panelBorder: 'rgba(15,23,42,0.10)',
  panelShadow:
    '0 10px 40px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
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
