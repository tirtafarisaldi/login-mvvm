import { ReactNode } from 'react';
import type { FilterItem } from './Filter/types';

export type FilterOption = 'all' | 'today' | 'yesterday' | 'last week' | 'custom' | number;

export interface DatePickerProps {
  queryStartDate: string | string[] | undefined;
  queryEndDate: string | string[] | undefined;
  showDropdownFilterTable?: boolean;
  setShowDropdownFilterTable: (isShow: boolean) => void;
  dateFilter?: string;
  setDateFilter?: (inputDate: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate?: Date | null;
  setEndDate: (date: Date | null) => void;
  applyFilterEvent?: () => void;
  position?: 'left' | 'right';
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  filterItems?: Array<FilterItem>;
  filteredItem?: FilterOption;
  setFilteredItem?: (item: FilterOption | undefined) => void;
  handleConfirm?: (param?: any) => void;
  selectsRange?: boolean;
  infoComponent?: ReactNode;
  containerWidth?: string;
  width?: string;
  ref?: any;
  label?: string;
  placeholder?: string;
  icon?: any;
  value: string;
  disabled?: boolean;
  isClear?: boolean;
  variant?: 'basic' | 'modal';
  required?: boolean;
}
