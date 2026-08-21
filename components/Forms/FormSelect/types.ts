import type { Size } from 'common-types';
import type { ChangeEventHandler, ReactNode, SelectHTMLAttributes } from 'react';

export type Value = string | number | readonly string[] | undefined;

export type Option = {
  value: Value;
  label: string;
};

export interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  selectedOption: Value;
  setSelectedOption: ChangeEventHandler<HTMLSelectElement>;
  options: Option[];
  children?: ReactNode;
  label?: string;
  size: Size;
}
