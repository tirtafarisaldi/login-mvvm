import { extendTheme } from '@chakra-ui/react';
import { colors, breakpoints } from './constants';

import Alert from 'components/Alert/styleConfig';
import Text from 'components/Typography/Text/styleConfig';
import Switch from 'components/Switch/styleConfig';

const theme = extendTheme({
  fonts: {
    poppins: 'Poppins',
    body: 'Poppins, sans-serif'
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
            justifyContent: 'flex-end'
          }
        }
      }
    }
  },
  colors,
  breakpoints
});

export default theme;
