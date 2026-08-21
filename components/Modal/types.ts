import type { ModalProps as ChakraUiModalProps, ModalContentProps } from '@chakra-ui/react';

export interface ModalProps extends ChakraUiModalProps {
  maxWidth?: ModalContentProps['maxWidth'];
  maxHeight?: ModalContentProps['maxHeight'];
  width?: ModalContentProps['width'];
  height?: ModalContentProps['height'];
}
