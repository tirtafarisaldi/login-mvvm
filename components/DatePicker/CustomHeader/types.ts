import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

export type CustomHeaderProps = ReactDatePickerCustomHeaderProps & {
  setMonthDate: (date: Date) => void;
};
