import { type ReactNode } from 'react';
import { HeaderProps } from './Header/types';

export interface MainProps {
  crumbs: HeaderProps['crumbs'];
  children: ReactNode;
  title?: string;
}
