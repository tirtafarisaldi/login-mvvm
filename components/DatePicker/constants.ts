import type { FilterItem } from './Filter/types';

export const FILTER_ITEMS: Array<FilterItem> = [
  {
    key: 'all',
    label: 'Semua Hari'
  },
  {
    key: 'last week',
    label: '7 Hari Terakhir'
  },
  {
    key: 15,
    label: '15 Hari Terakhir'
  },
  {
    key: 30,
    label: '30 Hari Terakhir'
  },
  {
    key: 'custom',
    label: 'Lainnya'
  }
];
