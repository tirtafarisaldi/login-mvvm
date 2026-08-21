import type { ReactElement, ReactNode } from 'react';

export interface DropdownSearchProps {
  options: any;
  selectedOption: any;
  setSelectedOption: (value: any) => void;
  name?: string;
  placeholder?: string;
  placeholderTarget?: string;
  size?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  onChange?: (value: any) => void;
  isTopPlaceholder?: boolean;
  customDropdown?: ReactElement;
  optionContainerWidth?: string;
  optionContainerPosition: 'left' | 'right';
  containerWidth?: string;
  required?: boolean;
  keyName?: string;
  handleSearchOption?: (value: string) => void;
  searchOption?: string;
  tooltipLabel?: string | ReactNode;
  loading?: boolean;
}
