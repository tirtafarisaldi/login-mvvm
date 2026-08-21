import { BoxProps } from '@chakra-ui/react';

export interface StatusLabelProps extends BoxProps {
  status?: string;
  label?: string;
  type?: string;
}
