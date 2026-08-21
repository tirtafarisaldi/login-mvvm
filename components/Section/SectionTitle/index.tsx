import type { FC } from 'react';
import type { SectionTitleProps } from './types';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const SectionTitle: FC<SectionTitleProps> = ({ text, ...props }) => {
  return (
    <Text
      {...props}
      as="h2"
      variant="headingXLargeBlack"
      color={colors.darkWillow}
      textAlign="left"
    >
      {text}
    </Text>
  );
};

export default SectionTitle;
