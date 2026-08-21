export type FilterOption = 'today' | 'yesterday' | 'last week' | 'custom';

export interface FilterDatePickerProps {
  queryStartDate: string | string[] | undefined;
  queryEndDate: string | string[] | undefined;
  showDropdownFilterTable?: boolean;
  setShowDropdownFilterTable: (isShow: boolean) => void;
  dateFilter?: string;
  setDateFilter?: (inputDate: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  applyFilterEvent?: () => void;
  position?: 'left' | 'right';
}
