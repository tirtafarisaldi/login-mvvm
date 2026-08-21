import type { FC } from 'react';

import FilterItem from './FilterItem';
import type { FilterProps } from './types';
import { Box } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';

const Filter: FC<FilterProps> = ({ selectedFilter, handleSelect, items }) => {
  return (
    <Box
      as="ul"
      className="w-full min-w-166px"
      borderRight="solid 1px"
      borderColor={colors.callaLily}
    >
      {items.map((item, i) => (
        <FilterItem
          key={i}
          label={item.label}
          isActive={selectedFilter === item.key}
          isBordered={i === items.length - 1}
          handleClick={() => handleSelect(item.key)}
        />
      ))}
    </Box>
  );
};

export default Filter;
