import type { FC } from 'react';
import type { ModalFooterProps } from './types';
import { ModalFooter as ChakraUiModalFooter } from '@chakra-ui/react';

export const ModalFooter: FC<ModalFooterProps> = ({ children, ...rest }) => (
  <ChakraUiModalFooter px="24px" py="16px" borderTop="1px" borderColor="#E5E9EC" {...rest}>
    {children}
  </ChakraUiModalFooter>
);
