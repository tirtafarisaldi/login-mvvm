import { BoxProps } from '@chakra-ui/react';

export interface TabItem {
  title: string;
  isActive: boolean;
  url?: string;
}

export interface TabProps extends BoxProps {
  type: 'line' | 'rounded';
  isBordered?: boolean;
  items: TabItem[];
}
