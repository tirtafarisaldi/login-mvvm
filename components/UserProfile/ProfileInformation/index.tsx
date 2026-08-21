import type { FC } from 'react';
import type { ProfileInformationProps } from './types';
import { Box, useClipboard } from '@chakra-ui/react';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';
import Email from 'components/Icon/Email';
import Profile from 'components/Icon/Profile';
import Phone from 'components/Icon/Phone';
import InformationItem from './InformationItem';

const ProfileInformation: FC<ProfileInformationProps> = ({ email, id, phone }) => {
  const { onCopy: onCopyEmail, hasCopied: hasCopiedEmail } = useClipboard(email);
  const { onCopy: onCopyPhone, hasCopied: hasCopiedPhone } = useClipboard(phone);
  const { onCopy: onCopyId, hasCopied: hasCopiedId } = useClipboard(id);

  return (
    <Box p="14px 16px">
      <Text variant="captionBold" color={colors.blackLead} mb="8px">
        Profile Information
      </Text>
      <Box borderRadius="4px" border="solid 1px" borderColor={colors.callaLily}>
        {!!email && (
          <InformationItem
            hasCopied={hasCopiedEmail}
            icon={<Email isLine fill={colors.tarnishedSilver} width={18} height={18} />}
            label={email}
            onCopy={onCopyEmail}
            isBordered
          />
        )}
        {!!phone && (
          <InformationItem
            hasCopied={hasCopiedPhone}
            icon={<Phone isLine fill={colors.tarnishedSilver} width={18} height={18} />}
            label={phone}
            onCopy={onCopyPhone}
            isBordered
          />
        )}
        {!!id && (
          <InformationItem
            hasCopied={hasCopiedId}
            icon={<Profile isLine fill={colors.tarnishedSilver} width={18} height={18} />}
            label={id}
            onCopy={onCopyId}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfileInformation;
