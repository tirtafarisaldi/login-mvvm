import { extendTheme } from '@chakra-ui/react';
import { colors, breakpoints } from './constants';

import Alert from 'components/Alert/styleConfig';
import Text from 'components/Typography/Text/styleConfig';
import Switch from 'components/Switch/styleConfig';

const theme = extendTheme({
  fonts: {
    heading: "'Poppins', sans-serif",
    poppins: 'Poppins',
    body: "'Poppins', sans-serif",
    mono: "'Poppins', sans-serif",
  },
  components: {
    CustomAlert: Alert,
    CustomText: Text,
    Switch,
    Modal: {
      variants: {
        sidebar: {
          content: {
            display: 'flex',
            justifyContent: 'flex-end',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _hover: {
            borderColor: 'blue.400',
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          _hover: {
            borderColor: 'blue.400',
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        _hover: {
          borderColor: 'blue.400',
        },
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          _hover: {
            borderColor: 'blue.400',
          },
        },
      },
    },
    Popover: {
      defaultProps: {
        flip: false,
      },
    },
    Menu: {
      defaultProps: {
        flip: false,
      },
    },
  },
  colors,
  breakpoints,
});

export default theme;
