import type { LinkProps } from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type Appearance = 'outline' | 'cancel' | 'text';

export type Size = 'large';

export type ButtonProps = {
  appearance?: Appearance;
  size?: Size;
  mergeClass?: string;
  text: string | ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'] | 'link';
  href?: LinkProps['href'];
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
} & Omit<LinkProps, 'href'> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;
