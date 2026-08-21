import type { LinkProps } from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonLinkWithLogoProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'] | 'link';
  href?: LinkProps['href'];
  mergeClass?: string;
  textColor?: string;
} & Omit<LinkProps, 'href'> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;
