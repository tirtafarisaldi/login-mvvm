import type { FC } from 'react';
import type { TextProps } from './types';
import { Box, useStyleConfig } from '@chakra-ui/react';

const Text: FC<TextProps> = ({ variant, children, ...props }) => {
  const styles = useStyleConfig('CustomText', { variant });
  return (
    <Box as="p" __css={styles} {...props}>
      {children}
    </Box>
  );
};

export default Text;
