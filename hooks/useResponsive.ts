import { useMediaQuery } from '@chakra-ui/react';
import { useMemo } from 'react';

import { breakpoints } from 'styles/theme/constants';

const useResponsive = () => {
  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.md})`);
  return useMemo(
    () => ({
      isMobile
    }),
    [isMobile]
  );
};

export default useResponsive;
