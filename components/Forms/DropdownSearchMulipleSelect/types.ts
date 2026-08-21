import type { Size } from 'common-types';
import { ReactNode } from 'react';
import type { Props } from 'react-select';

export interface DropdownSearchMultipleProps extends Props {
  options: any;
  selectedOption: any;
  setSelectedOption: (value: any) => void;
  name?: string;
  placeholder?: string;
  placeholderTarget?: string;
  size?: Size;
  noOptionsMessage?: any;
  loadOptions?: any;
  additional?: any;
  isDisabled?: boolean;
  isSearchable?: boolean;
  required?: boolean;
  handleSearchOption?: (value: string) => void;
  containerWidth?: string;
  keyName?: string;
  type?: 'input' | 'filter';
  hideSelectOption?: boolean;
  tooltipLabel?: string | ReactNode;
  loading?: boolean;
  customOption?: any;
}
