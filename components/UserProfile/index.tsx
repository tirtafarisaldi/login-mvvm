import { useState, useEffect, useRef, type FC } from 'react';
import type { UserProfileProps } from './types';
import { HStack, Box, Tooltip, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import Image from 'next/image';
import { colors } from 'styles/theme/constants';
import Text from 'components/Typography/Text';
import ProfileInformation from './ProfileInformation';

const UserProfile: FC<UserProfileProps> = ({ avatar, status, phone, email, id, name }) => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const [generatedAvatar, setGeneratedAvatar] = useState<string>('/empty-avatar.png');
  const [statusColor, setStatusColor] = useState<string>(colors.bastille);

  useOutsideClick({
    ref: avatarRef,
    handler: onClose
  });

  useEffect(() => {
    // Avatar
    if (!!avatar) setGeneratedAvatar(avatar);

    // Status Color
    switch (status) {
      case 'active':
        setStatusColor(colors.greenish);
        break;
      case 'inactive':
      case 'temporary-inactive':
        setStatusColor(colors.dairyMade);
        break;
      default:
        setStatusColor(colors.bastille);
        break;
    }
  }, [avatar, status]);

  return (
    <HStack spacing="16px" align="center" minW="200px">
      <Box
        pos="relative"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Tooltip
          hasArrow
          arrowShadowColor={colors.callaLily}
          p={0}
          border="solid 1px"
          borderRadius="4px"
          borderColor={colors.callaLily}
          label={<ProfileInformation phone={phone} email={email} id={id} />}
          bg={colors.white}
          placement="bottom-start"
          isOpen={isOpen}
          pointerEvents={'all'}
          onClick={() => {
            onOpen();
          }}
        >
          <Box
            ref={avatarRef}
            borderRadius="40px"
            width="40px"
            height="40px"
            pos="relative"
            overflow="hidden"
            cursor="pointer"
            onClick={onToggle}
          >
            <Image src={generatedAvatar} layout="fill" objectFit="cover" alt="" />
          </Box>
        </Tooltip>
        <Tooltip
          bg={colors.white}
          label={
            <Text variant="captionRegular" color={statusColor} textTransform="capitalize">
              {status}
            </Text>
          }
          placement="bottom-start"
        >
          <Box
            w="10px"
            h="10px"
            bg={statusColor}
            pos="absolute"
            bottom={0}
            left={0}
            borderRadius="10px"
            border="solid 1px"
            borderColor={colors.white}
          />
        </Tooltip>
      </Box>
      <Box>
        <Text variant="bodySmallRegular" color={colors.darkWillow}>
          {name}
        </Text>
        <Text variant="captionRegular" color={colors.tarnishedSilver}>
          {email}
        </Text>
      </Box>
    </HStack>
  );
};

export default UserProfile;
