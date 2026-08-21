import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode, createContext, useState } from 'react';

export const LayoutContext = createContext(true);

const Layout = ({ children, ...props }: { children?: ReactNode } & BoxProps) => {
  const [expandedSidebar, setExpandedSidebar] = useState(true);
  return (
    <>
      <Box {...props}>
        <LayoutContext.Provider value={expandedSidebar}>{children}</LayoutContext.Provider>
      </Box>
    </>
  );
};

export default Layout;
