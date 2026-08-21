import type { LinkProps as ChakraUiLinkProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export interface LinkProps extends Omit<ChakraUiLinkProps, 'href'> {
  children: ReactNode;
  href: string;
}
