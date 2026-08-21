import type { FilterOption } from '../types';

export interface FilterItem {
  key: FilterOption;
  label: string;
}

export interface FilterProps {
  items: Array<FilterItem>;
  selectedFilter?: FilterOption;
  handleSelect: (key: FilterOption) => void;
}
