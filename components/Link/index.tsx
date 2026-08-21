import { Link as ChakraUiLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { FC } from 'react';

import type { LinkProps } from './types';

const Link: FC<LinkProps> = ({ href, children, ...props }) => {
  return (
    <NextLink passHref href={href}>
      <ChakraUiLink {...props}>{children}</ChakraUiLink>
    </NextLink>
  );
};

export default Link;
