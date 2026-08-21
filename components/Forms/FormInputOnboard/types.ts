import type { ReactElement, ReactNode, InputHTMLAttributes } from 'react';

export interface FormInputOnboardProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactElement;
  children?: ReactNode;
}
