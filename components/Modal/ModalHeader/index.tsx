import type { FC } from 'react';
import type { ModalHeaderProps } from './types';
import { ModalHeader as ChakraUiModalHeader } from '@chakra-ui/react';

export const ModalHeader: FC<ModalHeaderProps> = ({ children, isBordered = true, ...rest }) => (
  <ChakraUiModalHeader
    padding={`24px 24px ${isBordered ? '24px' : '0'}`}
    borderBottom={isBordered ? '1px' : 0}
    borderColor="#E5E9EC"
    color="darkWillow"
    fontWeight="900"
    size="18px"
    lineHeight="23px"
    {...rest}
  >
    {children}
  </ChakraUiModalHeader>
);
