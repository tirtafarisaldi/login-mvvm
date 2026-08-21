import type { Size } from 'common-types';

export interface ReactSelectV2Props {
  options: any;
  selectedOption: any;
  setSelectedOption: (value: any) => void;
  name: string;
  placeholder?: string;
  size?: Size;
  noOptionsMessage?: any;
  loadOptions?: any;
  additional?: any;
  isDisabled?: boolean;
  isSearchable?: boolean;
}
