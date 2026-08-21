import type { Size } from 'common-types';

export interface ReactSelectAsyncPaginateProps {
  options?: any;
  selectedOption?: any;
  setSelectedOption?: () => void;
  name: string;
  placeholder?: string;
  size?: Size;
  value: any;
  noOptionsMessage?: any;
  loadOptions?: any;
  onChange: (value: any) => void;
  additional?: any;
  isDisabled?: boolean;
}
