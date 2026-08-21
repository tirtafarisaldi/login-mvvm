import type { IconProps } from '@chakra-ui/react';
import type { ComponentType, ReactElement } from 'react';

export interface InformationItemProps {
  label: string;
  hasCopied: boolean;
  onCopy: () => void;
  isBordered?: boolean;
  icon: ReactElement;
}
