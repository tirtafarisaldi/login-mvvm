import { defineStyleConfig } from '@chakra-ui/react';

const Alert = defineStyleConfig({
  baseStyle: {
    borderRadius: '8px',
    padding: { base: '12px 16px', md: '8px 16px' }
  },
  variants: {
    default: {
      bg: 'transparent',
      color: 'darkWillow',
      border: '1px',
      borderColor: 'callaLily'
    },
    warning: {
      bg: 'sleepLamp',
      color: 'oldTrail'
    },
    info: {
      bg: 'cloudless',
      color: 'amnesiaBlue'
    },
    success: {
      bg: 'ottoIce',
      color: 'jordanJazz'
    },
    error: {
      bg: 'maryRose',
      color: 'sunScarlet'
    }
  },
  defaultProps: {
    variant: 'default'
  }
});

export default Alert;
