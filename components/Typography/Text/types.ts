import { BoxProps } from '@chakra-ui/react';

export interface TextProps extends BoxProps {
  variant:
    | 'captionSmall'
    | 'captionRegular'
    | 'captionBold'
    | 'buttonSmallBold'
    | 'buttonMediumBold'
    | 'paragraphSmallRegular'
    | 'paragraphSmallBold'
    | 'bodySmallRegular'
    | 'paragraphMediumRegular'
    | 'bodySmallBold'
    | 'bodyMediumRegular'
    | 'bodyMediumBold'
    | 'bodyLargeRegular'
    | 'footnoteRegular'
    | 'footnoteBold'
    | 'headlineRegular'
    | 'headlineBold'
    | 'headingXHugeBlack'
    | 'headingXLargeBlack'
    | 'headingLargeBlack'
    | 'headingLargeBold'
    | 'headingMediumBlack'
    | 'headingSmallBlack';
}
