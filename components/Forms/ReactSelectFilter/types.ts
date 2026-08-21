import type { Size } from 'common-types';
import { ReactNode } from 'react';

export interface ReactSelectFilterProps {
  options: any;
  selectedOption: any;
  setSelectedOption: (value: any) => void;
  name?: string;
  placeholder?: string;
  size?: Size;
  noOptionsMessage?: any;
  loadOptions?: any;
  additional?: any;
  isDisabled?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  containerWidth?: string;
  isClear?: boolean;
  required?: boolean;
  tooltipLabel?: string | ReactNode;
}
