import { BoxProps } from '@chakra-ui/react';
import type { TextProps } from 'components/Typography/Text/types';

export interface SectionTitleProps extends BoxProps {
  text: TextProps['children'];
}
