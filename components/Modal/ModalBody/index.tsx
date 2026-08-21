import type { FC } from 'react';
import type { ModalBodyProps } from './types';
import { ModalBody as ChakraUiModalBody } from '@chakra-ui/react';

export const ModalBody: FC<ModalBodyProps> = ({ children, ...rest }) => (
  <ChakraUiModalBody py="16px" px="24px" {...rest}>
    {children}
  </ChakraUiModalBody>
);
