export type Color = 'red' | 'green' | 'blue' | 'orange' | 'black';

export interface PercentageBarProps {
  label: string;
  color?: Color;
  currentData: string | number;
  totalData: string | number;
  currentDataLabel?: string;
}
