import { Box, Divider } from '@chakra-ui/react';
import type { FC } from 'react';
import { When } from 'react-if';

import { colors } from 'styles/theme/constants';

import type { FilterItemProps } from './types';

const FilterItem: FC<FilterItemProps> = ({ isBordered, isActive, handleClick, label }) => {
  return (
    <>
      <When condition={isBordered}>
        <Divider my="12px" borderColor={colors.callaLily} />
      </When>
      <Box
        as="li"
        className={`cursor-pointer px-4 py-3 text-size14 font-bold leading-17px hover:bg-calla_lily ${
          isActive ? 'bg-calla_lily' : ''
        }`}
        bgColor={isActive ? colors.maryRose : 'none'}
        color={isActive ? colors.ottomanRed : colors.darkWillow}
        _hover={{
          bgColor: colors.maryRose,
          color: colors.ottomanRed
        }}
        onClick={handleClick}
      >
        {label}
      </Box>
    </>
  );
};

export default FilterItem;
