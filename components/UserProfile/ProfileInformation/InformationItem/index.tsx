import type { FC } from 'react';
import type { InformationItemProps } from './types';
import { HStack, StackDivider, Box } from '@chakra-ui/react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const InformationItem: FC<InformationItemProps> = ({
  isBordered = false,
  icon,
  onCopy,
  hasCopied,
  label
}) => {
  return (
    <HStack
      borderBottom={isBordered ? `solid 1px ${colors.callaLily}` : 'unset'}
      h="35px"
      align="center"
      px="8px"
      divider={<StackDivider borderColor={colors.callaLily} />}
    >
      <HStack align="center" spacing="8px" w="215px">
        {icon}
        <Text
          variant="captionRegular"
          color={colors.bastille}
          className="truncate"
          bg={
            hasCopied
              ? `linear-gradient(to left, transparent 50%, ${colors.callaLily} 50%) right;`
              : 'transparent'
          }
          bgSize="200%"
          bgPosition={hasCopied ? 'left' : 'right'}
          transition=".2s ease-out"
        >
          {label}
        </Text>
      </HStack>
      <Box cursor="pointer" onClick={onCopy}>
        <Text variant="buttonSmallBold" color={colors.deepSkyBlue}>
          Copy
        </Text>
      </Box>
    </HStack>
  );
};

export default InformationItem;
