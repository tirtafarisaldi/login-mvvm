import { format as formatCustomDate } from 'date-fns';
import isSameYear from 'date-fns/isSameYear';
import isSameMonth from 'date-fns/isSameMonth';

const indonesianMonth = [
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
  'Desember'
];

export const indonesianDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  return date.getDate() + ' ' + indonesianMonth[date.getMonth()] + ' ' + date.getFullYear();
};

export const indonesianDateTime = (timestamp: number) => {
  if (timestamp === 0 || timestamp === null) return '-';
  const date = new Date(timestamp * 1000);

  return (
    date.getDate() +
    ' ' +
    indonesianMonth[date.getMonth()] +
    ' ' +
    date.getFullYear() +
    '-' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0')
  );
};

export const indonesianDateRange = (start: number, end: number) => {
  const dateLeft = new Date(start * 1000);
  const dateRight = new Date(end * 1000);

  if (isSameYear(dateLeft, dateRight)) {
    if (isSameMonth(dateLeft, dateRight)) {
      return `${dateLeft.getDate()} - ${indonesianDate(end)}`;
    }

    return `${dateLeft.getDate()} ${indonesianMonth[dateLeft.getMonth()]} - ${indonesianDate(end)}`;
  }

  return `${indonesianDate(start)} - ${indonesianDate(end)}`;
};

export const getHours = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  return String(date.getHours()).padStart(2, '0');
};

// Function to determine the number of days in a month
export const daysInMonth = (month: number, year: number) => {
  // Day 0 is the last day in the previous month.
  // Because the month constructor is 0-based, this works nicely.
  // A bit of a hack, but that's basically what you're doing by subtracting 32.
  return new Date(year, month, 0).getDate();
};

/**
 * @param {string|undefined} strDate date-times string format
 * @returns {number} timestamp in seconds
 */
export const toTimestamp = (strDate?: string) => {
  const date = strDate ? new Date(strDate) : new Date();
  return date.getTime() / 1000;
};

export const formatFilterDate = (date: Date | null) => {
  if (date != null) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .split('T')[0];
  }
};

export const setMinDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const formatAMPM = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let formattedHours = hours % 12;
  formattedHours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = formattedHours + ':' + formattedMinutes + ' ' + ampm;

  return strTime;
};

export const customFormatDate = (
  date: Date,
  format: string,
  options?: {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: number;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  }
) => {
  const strTime = formatCustomDate(date, format, options);

  return strTime;
};
