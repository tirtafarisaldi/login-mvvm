import { type FC, useContext } from 'react';
import type { MainProps } from './types';
import { Box } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';
import Header from './Header';
import SectionTitle from 'components/Section/SectionTitle';
import React from 'react';
import { LayoutContext } from 'layouts';

const Main: FC<MainProps> = ({ crumbs, title, children }) => {
  const expandedSidebar = useContext(LayoutContext);
  return (
    <Box display={{ base: 'block', md: 'flex' }}>
      <Box
        w={'100%'}
        maxW={{ md: `calc(100% - ${expandedSidebar ? '300px' : '100px'})` }}
        ml={{ md: expandedSidebar ? '300px' : '100px' }}
        bgColor={colors.callaLily}
        pl={{ base: 0, md: '3rem' }}
      >
        <Header crumbs={crumbs} />
        {title && (
          <SectionTitle
            text={title}
            fontSize={'24px'}
            color={colors.darkWillow}
            fontWeight={900}
            paddingBottom={'16px'}
            paddingLeft={{ base: '1rem', md: 0 }}
          />
        )}
        <Box
          pl={{ base: '1rem', md: 0 }}
          pr={{ base: '1rem', md: '2rem' }}
          pb={{ base: '1rem', md: 0 }}
          minH={'100vh'}
        >
          <Box
            pos={'relative'}
            borderRadius={'1rem'}
            bgColor={colors.white}
            p="1.5rem"
            mb={{ base: 0, md: '4rem' }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Main);
