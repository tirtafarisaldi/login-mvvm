import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

const baseStyle = definePartsStyle({
  track: {
    _checked: {
      bg: colors.ottomanRed
    }
  }
});

const switchTheme = defineMultiStyleConfig({ baseStyle });

export default switchTheme;
