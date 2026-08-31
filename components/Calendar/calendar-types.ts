export type EventColor =
  | 'blue'
  | 'cyan'
  | 'green'
  | 'orange'
  | 'violet'
  | 'rose';

export interface CalendarEvent {
  id: string;
  dateKey: string;
  title: string;
  start: string;
  end: string;
  location: string;
  organizer: string;
  color: EventColor;
  note?: string;
}

export const WEEKDAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

export const isSameDay = (a: Date, b: Date): boolean =>
  toDateKey(a) === toDateKey(b);

export const startOfMondayWeek = (date: Date): Date => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return day;
};

export const buildMonthDays = (year: number, month: number): Date[] => {
  const start = startOfMondayWeek(new Date(year, month, 1));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};