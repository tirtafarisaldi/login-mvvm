import { type FC } from 'react';
import type { AuthProps } from './types';
import { Box, Flex } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';

const Auth: FC<AuthProps> = ({ children }) => {
  return (
    <main>
      <Flex
        as="section"
        position={'relative'}
        w={'100%'}
        h={'100%'}
        py={'2rem'}
        minH={'100vh'}
        align={'center'}
        bgColor={colors.doctorWhite}
      >
        {children}
      </Flex>
    </main>
  );
};

export default Auth;
