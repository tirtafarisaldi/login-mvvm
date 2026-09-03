import { Box } from '@chakra-ui/react';
import { format } from 'date-fns';
import type { FC } from 'react';

import type { CustomDayProps } from './types';
import { colors } from 'styles/theme/constants';

const CustomDay: FC<CustomDayProps> = ({ date }) => {
  return (
    <Box position="relative">
      <Box
        className="customDayRectangle"
        display="none"
        width="100%"
        height="100%"
        backgroundColor={colors.maryRose}
        position="absolute"
        left="0"
        top="0"
        zIndex="3"
      />
      <Box
        className="customDayCircle"
        display="none"
        width="32px"
        height="32px"
        borderRadius="32px"
        position="absolute"
        left="50%"
        marginLeft="-16px"
        top="50%"
        marginTop="-16px"
        zIndex="4"
        backgroundColor={colors.ottomanRed}
      />
      <Box
        className="customDayText"
        width="32px"
        height="32px"
        lineHeight="32px"
        fontFamily="poppins"
        fontStyle="normal"
        fontWeight="400"
        fontSize="14px"
        textAlign="center"
        color={colors.darkWillow}
        margin="auto"
        position="relative"
        zIndex={5}
      >
        {format(date, 'd')}
      </Box>
    </Box>
  );
};

export default CustomDay;
