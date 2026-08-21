import type { ReactElement, ReactNode, InputHTMLAttributes } from 'react';

export interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label: string;
  size: 'small' | 'large';
  icon?: ReactElement;
  children?: ReactNode;
  error?: boolean;
  width?: string;
  onChange?: (val: string) => void;
  showMaxLength?: boolean;
  handleShow?: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef?: React.MutableRefObject<null>;
}
