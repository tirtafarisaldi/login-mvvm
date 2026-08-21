import { BoxProps } from '@chakra-ui/react';

export type Variant = 'default' | 'warning' | 'info' | 'success' | 'error';

export interface AlertProps extends BoxProps {
  variant: Variant;
  dismiss?: () => void;
}
