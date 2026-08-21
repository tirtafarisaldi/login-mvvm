import { defineStyleConfig } from '@chakra-ui/react';

const Text = defineStyleConfig({
  baseStyle: {
    fontFamily: 'lato'
  },
  variants: {
    captionSmall: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '19px'
    },
    captionRegular: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '19px'
    },
    captionBold: {
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '19px'
    },
    buttonSmallBold: {
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '14px'
    },
    buttonMediumBold: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '17px'
    },
    paragraphSmallRegular: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px'
    },
    paragraphSmallBold: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '22px'
    },
    bodySmallRegular: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '22px'
    },
    paragraphMediumRegular: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '26px'
    },
    bodySmallBold: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '22px'
    },
    bodyMediumRegular: {
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '24px'
    },
    bodyMediumBold: {
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px'
    },
    bodyLargeRegular: {
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '24px'
    },
    footnoteRegular: {
      fontWeight: 400,
      fontSize: '11px',
      lineHeight: '15px'
    },
    footnoteBold: {
      fontWeight: 700,
      fontSize: '11px',
      lineHeight: '15px'
    },
    headlineRegular: {
      fontWeight: 400,
      fontSize: '11px',
      lineHeight: '13px'
    },
    headlineBold: {
      fontWeight: 700,
      fontSize: '11px',
      lineHeight: '13px',
      letterSpacing: '0.1em'
    },
    headingXHugeBlack: {
      fontSize: '28px',
      lineHeight: '35px',
      fontWeight: 900,
      letterSpacing: '-0.005em'
    },
    headingXLargeBlack: {
      fontSize: '20px',
      lineHeight: '26px',
      fontWeight: 900,
      letterSpacing: '-0.005em'
    },
    headingLargeBlack: {
      fontSize: '18px',
      fontWeight: 900,
      lineHeight: '24px'
    },
    headingLargeBold: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '24px'
    },
    headingMediumBlack: {
      fontSize: '16px',
      fontWeight: 900,
      lineHeight: '21px'
    },
    headingSmallBlack: {
      fontSize: '14px',
      fontWeight: 900,
      lineHeight: '19px'
    }
  }
});

export default Text;
