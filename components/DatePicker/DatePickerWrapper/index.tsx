import { Box } from '@chakra-ui/react';
import type { FC } from 'react';

import { colors } from 'styles/theme/constants';

import type { DatePickerWrapperProps } from './types';

const DatePickerWrapper: FC<DatePickerWrapperProps> = ({ isDateRange, children }) => (
  <Box
    sx={{
      '.react-datepicker': {
        border: 0,
        width: '100%',
        '.react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover':
          {
            backgroundColor: 'transparent'
          },
        '.react-datepicker__month-container': {
          float: 'none',
          '.react-datepicker__header': {
            backgroundColor: 'unset',
            border: 0,

            '.react-datepicker__day-names': {
              display: 'flex',
              padding: '0 26px 0',
              backgroundColor: colors.flashWhite,
              height: '37px',
              alignItems: 'center',

              '.react-datepicker__day-name': {
                flex: 1,
                margin: 0,
                padding: 0,
                textTransform: 'uppercase',
                fontFamily: 'Lato',
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '11px',
                lineHeight: '13px',
                letterSpacing: '0.1em',
                color: colors.darkWillow
              }
            }
          },

          '.react-datepicker__month': {
            margin: 0,
            padding: '10px 26px',
            '.react-datepicker__week': {
              display: 'flex',
              margin: '14px 0',
              '&:first-of-type': {
                marginTop: 0
              },
              '&:last-child': {
                marginTop: 0
              },

              '.react-datepicker__day': {
                flex: 1,
                margin: 0,
                padding: 0,
                position: 'relative',

                '&.react-datepicker__day--selected': {
                  '.customDayCircle': {
                    display: 'block'
                  },
                  '.customDayText': {
                    color: '#ffffff'
                  }
                },

                '&.react-datepicker__day--disabled': {
                  opacity: '0.5'
                },

                '&.react-datepicker__day--in-range,&.react-datepicker__day--selected,&.react-datepicker__day--in-selecting-range':
                  {
                    background: 'none'
                  },

                '&.react-datepicker__day--range-start,&.react-datepicker__day--range-end,&.react-datepicker__day--selecting-range-start':
                  {
                    '.customDayText': {
                      color: '#ffffff'
                    },

                    '.customDayCircle': {
                      display: 'block'
                    },

                    '.customDayRectangle': {
                      width: '50%'
                    }
                  },

                '&.react-datepicker__day--in-range': {
                  '.customDayRectangle': {
                    display: `${isDateRange ? 'block' : 'none'}`
                  },

                  '&:not(.react-datepicker__day--range-start, .react-datepicker__day--range-end):last-child':
                    {
                      '&::after': {
                        content: '""',
                        width: '26px',
                        height: '100%',
                        position: 'absolute',
                        right: '-26px',
                        top: 0,
                        backgroundColor: colors.maryRose,
                        display: `${isDateRange ? 'block' : 'none'}`
                      }
                    },
                  '&:not(.react-datepicker__day--range-start, .react-datepicker__day--range-end):first-of-type':
                    {
                      '&::after': {
                        content: '""',
                        width: '26px',
                        height: '100%',
                        position: 'absolute',
                        left: '-26px',
                        top: 0,
                        backgroundColor: colors.maryRose,
                        display: `${isDateRange ? 'block' : 'none'}`
                      }
                    }
                },

                '&.react-datepicker__day--range-start': {
                  '.customDayRectangle': {
                    left: 'unset',
                    right: 0
                  },

                  '&:last-child': {
                    '&::after': {
                      content: '""',
                      width: '26px',
                      height: '100%',
                      position: 'absolute',
                      right: '-26px',
                      top: 0,
                      backgroundColor: colors.maryRose,
                      display: `${isDateRange ? 'block' : 'none'}`
                    }
                  }
                },

                '&.react-datepicker__day--range-end': {
                  '.customDayRectangle': {
                    right: 'unset',
                    left: 0
                  },

                  '&:first-of-type': {
                    '&::after': {
                      content: '""',
                      width: '26px',
                      height: '100%',
                      position: 'absolute',
                      left: '-26px',
                      top: 0,
                      backgroundColor: colors.maryRose,
                      display: `${isDateRange ? 'block' : 'none'}`
                    }
                  }
                }
              }
            }
          }
        }
      }
    }}
  >
    {children}
  </Box>
);

export default DatePickerWrapper;
