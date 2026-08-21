import { useRef, type FC } from 'react';
import type { ModalProps } from './types';
import { Modal as ChakraUiModal, ModalOverlay, ModalContent } from '@chakra-ui/react';
import useResponsive from 'hooks/useResponsive';

export const Modal: FC<ModalProps> = ({
  maxWidth,
  maxHeight,
  width,
  height,
  children,
  isCentered,
  ...rest
}) => {
  const { isMobile } = useResponsive();
  return (
    <ChakraUiModal isCentered={isCentered || !isMobile} {...rest}>
      <ModalOverlay />
      <ModalContent
        maxW={maxWidth}
        maxH={maxHeight}
        height={height}
        width={width}
        borderRadius="8px"
        fontFamily="lato"
        mx={{ base: '16px', md: '0px' }}
        my={{ base: '16px', md: 0 }}
        containerProps={{
          justifyContent: isCentered ? 'center' : 'flex-end',
          alignItems: 'center'
        }}
      >
        {children}
      </ModalContent>
    </ChakraUiModal>
  );
};

export * from './ModalHeader';
export * from './ModalFooter';
export * from './ModalBody';
