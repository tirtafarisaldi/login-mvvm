import type { EventColor } from './calendar-types';

export interface EventColorStyle {
  chipBg: string;
  chipBorder: string;
  text: string;
  dot: string;
}

export const palette: Record<EventColor, EventColorStyle> = {
  blue: {
    chipBg: '#dbeafe',
    chipBorder: '#93c5fd',
    text: '#1e3a8a',
    dot: '#3b82f6',
  },
  cyan: {
    chipBg: '#cffafe',
    chipBorder: '#67e8f9',
    text: '#155e75',
    dot: '#06b6d4',
  },
  green: {
    chipBg: '#d1fae5',
    chipBorder: '#6ee7b7',
    text: '#065f46',
    dot: '#10b981',
  },
  orange: {
    chipBg: '#fef3c7',
    chipBorder: '#fcd34d',
    text: '#78350f',
    dot: '#f59e0b',
  },
  violet: {
    chipBg: '#ede9fe',
    chipBorder: '#c4b5fd',
    text: '#4c1d95',
    dot: '#8b5cf6',
  },
  rose: {
    chipBg: '#ffe4e6',
    chipBorder: '#fda4af',
    text: '#881337',
    dot: '#f43f5e',
  },
};

export const CALENDAR_COLORS: EventColor[] = [
  'blue',
  'cyan',
  'green',
  'orange',
  'violet',
  'rose',
];

const hashKey = (key: string): number => {
  let hash = 0;
  const value = key.trim().toLowerCase();
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const colorFromKey = (key: string): EventColor =>
  CALENDAR_COLORS[hashKey(key) % CALENDAR_COLORS.length] ?? 'blue';