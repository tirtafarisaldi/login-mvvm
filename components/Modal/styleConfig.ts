import { defineStyleConfig } from '@chakra-ui/react';

const Modal = defineStyleConfig({
  baseStyle: {
    fontFamily: 'poppins'
  },
  variants: {
    sidebar: {
      display: 'flex',
      justifyContent: 'flexEnd'
    }
  }
});

export default Modal;
