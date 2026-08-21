import { Box, Flex, HStack, StackDivider, useBoolean } from '@chakra-ui/react';
import SectionContentWrapper from 'components/Section/SectionContentWrapper';
import SectionTitle from 'components/Section/SectionTitle';
import { useEffect, type FC } from 'react';
import { Else, If, Then } from 'react-if';
import Skeleton from './Skeleton';
import type { ProfileCardProps } from './types';
import Text from 'components/Typography/Text';
import { colors } from 'styles/theme/constants';

const ProfileCard: FC<ProfileCardProps> = ({ avatar, name, email, phone }) => {
  const [isLoading, setIsLoading] = useBoolean();

  useEffect(() => {
    setIsLoading.on();
    window.setTimeout(() => {
      setIsLoading.off();
    }, 1000);
  }, [setIsLoading]);
  return (
    <>
      <SectionTitle text="Profile" mb="16px" />
      <SectionContentWrapper mergeClass="mb-8">
        <If condition={isLoading}>
          <Then>
            <Skeleton />
          </Then>
          <Else>
            <Flex align={'center'} mb={{ base: '16px', md: 0 }} className="user-profile">
              <Box borderRadius={'80px'} overflow={'hidden'} mr="24px" flexShrink={0}>
                <img
                  src={avatar ?? '/empty-avatar.png'}
                  width="80"
                  height="80"
                  alt="default-avatar"
                />
              </Box>
              <Box wordBreak={'break-all'}>
                <Text as="h3" variant="headingXLargeBlack" color={colors.darkWillow} mb="8px">
                  {name ?? '-'}
                </Text>
                <HStack divider={<StackDivider />}>
                  <Text variant="captionRegular" color={colors.tarnishedSilver}>
                    {email}
                  </Text>
                  <Text variant="captionRegular" color={colors.tarnishedSilver}>
                    {phone}
                  </Text>
                </HStack>
              </Box>
            </Flex>
          </Else>
        </If>
      </SectionContentWrapper>
    </>
  );
};

export default ProfileCard;
