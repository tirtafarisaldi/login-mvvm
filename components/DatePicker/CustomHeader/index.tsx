import { Box } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect, type FC } from 'react';

import IconButton from 'components/Button/IconButton';
import ChevronLeft from 'components/Icon/ChevronLeft';
import ChevronRight from 'components/Icon/ChevronRight';

import type { CustomHeaderProps } from './types';

const CustomHeader: FC<CustomHeaderProps> = ({
  decreaseMonth,
  increaseMonth,
  date,
  monthDate,
  setMonthDate
}) => {
  useEffect(() => {
    setMonthDate(monthDate);
  }, [monthDate, setMonthDate]);

  return (
    <Box display="flex" px="26px" alignItems="center" justifyContent="center">
      <IconButton
        onClick={decreaseMonth}
        aria-label="Prev Month"
        variant="ghost"
        icon={<ChevronLeft />}
        _hover={{ bg: 'unset' }}
        _focus={{ bg: 'unset', outline: 'none' }}
      />
      <Box fontFamily="poppins" flex={1} color="darkWillow" fontSize="14px" fontWeight={700}>
        {format(date, 'MMMM yyyy')}
      </Box>
      <IconButton
        onClick={increaseMonth}
        aria-label="Prev Month"
        variant="ghost"
        icon={<ChevronRight />}
        _hover={{ bg: 'unset' }}
        _focus={{ bg: 'unset', outline: 'none' }}
      />
    </Box>
  );
};

export default CustomHeader;
