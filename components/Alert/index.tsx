import type { FC } from 'react';
import { Box, Fade, Flex, useStyleConfig } from '@chakra-ui/react';
import { Else, If, Then } from 'react-if';

import Close from 'components/Icon/Close';
import IconButton from 'components/Button/IconButton';
import { colors } from 'styles/theme/constants';
import type { AlertProps } from './types';

const Alert: FC<AlertProps> = ({ variant, children, dismiss, ...props }) => {
  const styles = useStyleConfig('CustomAlert', { variant });
  const fill = () => {
    switch (variant) {
      case 'default':
        return colors.darkWillow;
      case 'warning':
        return colors.oldTrail;
      case 'info':
        return colors.amnesiaBlue;
      case 'success':
        return colors.jordanJazz;
      case 'error':
        return colors.ottomanRed;
      default:
        return colors.darkWillow;
    }
  };

  return (
    <Box __css={styles} {...props}>
      <If condition={!!dismiss}>
        <Then>
          <Flex align="center" justifyContent="space-between">
            {children}
            <IconButton
              aria-label="close"
              icon={<Close fill={fill()} />}
              p={0}
              dimension={24}
              onClick={dismiss}
              ml="16px"
              _hover={{ bg: 'transparent' }}
              _focus={{ bg: 'transparent', outline: 'none' }}
              _active={{ bg: 'transparent' }}
            />
          </Flex>
        </Then>
        <Else>{children}</Else>
      </If>
    </Box>
  );
};

export default Alert;
