import {
  ArrowForwardIcon,
  CalendarIcon,
  InfoIcon,
  RepeatIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import GlassCard from '../../../../components/Cards/GlassCard/GlassCard';
import { useHomeViewModel } from '../viewModels/HomeViewModel';
import { useThemeStore } from '../../Menus/store/useThemeStore';
import { useThemeColors } from '../../Menus/store/themeColors';

const featureStyles = [
  { icon: InfoIcon, color: '#60a5fa' },
  { icon: RepeatIcon, color: '#a78bfa' },
  { icon: CalendarIcon, color: '#22d3ee' },
  { icon: ViewIcon, color: '#34d399' },
];

const statStyles = [
  { icon: ViewIcon, color: '#93c5fd' },
  { icon: RepeatIcon, color: '#fbbf24' },
  { icon: CalendarIcon, color: '#60a5fa' },
];

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function HomePage() {
  const { features, stats, statsLoading } = useHomeViewModel();
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const today = dateFormatter.format(new Date());

  const iconBoxBg =
    mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';
  const iconBoxBorder =
    mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <>
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'flex-end' }}
        gap={{ base: 4, md: 5 }}
        mb={8}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Heading
            as="h1"
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="shorter"
            color={theme.textPrimary}
            fontFamily="poppins"
          >
            Overview
          </Heading>
          <Text color={theme.textSecondary} mt={2} fontSize="sm" maxW="lg">
            Pilih menu untuk mulai mengelola aktivitas laboratorium, inventaris,
            booking, dan jadwal ruangan.
          </Text>
        </Box>
        <GlassCard radius="full" depth={10} maxTilt={6}>
          <Flex
            align="center"
            justify={{ base: 'flex-start', sm: 'center' }}
            gap={3}
            px={6}
            py={2.5}
            w={{ base: 'full', sm: 'auto' }}
          >
            <Box
              w={2}
              h={2}
              borderRadius="full"
              bg="blue.400"
              boxShadow="0 0 12px rgba(59,130,246,.9)"
            />
            <Text fontSize="xs" color={theme.textSecondary}>
              {today}
            </Text>
          </Flex>
        </GlassCard>
      </Flex>

      <SimpleGrid
        columns={{ base: 2, md: 3 }}
        spacing={{ base: 3, md: 3 }}
        mb={6}
      >
        {stats.map((stat, index) => {
          const style = statStyles[index % statStyles.length];
          return (
            <GlassCard key={stat.id} radius="2xl" depth={20}>
              <Flex
                align="center"
                gap={{ base: 3, md: 5 }}
                p={{ base: 4, md: 6 }}
              >
                <Box position="relative" flexShrink={0}>
                  {mode === 'dark' && (
                    <Box
                      position="absolute"
                      inset={-3}
                      borderRadius="full"
                      bg={`radial-gradient(circle, ${style.color}, transparent 68%)`}
                      opacity={0.5}
                    />
                  )}
                  <Flex
                    w={{ base: 9, md: 12 }}
                    h={{ base: 9, md: 12 }}
                    align="center"
                    justify="center"
                    position="relative"
                    borderRadius="2xl"
                    bg={iconBoxBg}
                    borderWidth="1px"
                    borderColor={iconBoxBorder}
                    color={style.color}
                  >
                    <Icon as={style.icon} boxSize={{ base: 4, md: 6 }} />
                  </Flex>
                </Box>
                <Box minW={0}>
                  <Text
                    color={theme.textMuted}
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    noOfLines={1}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    color={theme.textPrimary}
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="black"
                    letterSpacing="tight"
                    lineHeight="shorter"
                    mt={0.5}
                  >
                    {statsLoading ? '…' : stat.value.toLocaleString('id-ID')}
                  </Text>
                  <Text
                    color={theme.textSecondary}
                    fontSize="xs"
                    mt={1}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {stat.hint}
                  </Text>
                </Box>
              </Flex>
            </GlassCard>
          );
        })}
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 4 }}
        spacing={{ base: 3, md: 3 }}
      >
        {features.map((feature, index) => {
          const style = featureStyles[index % featureStyles.length];
          return (
            <GlassCard key={feature.id} radius="2xl" depth={26}>
              <Stack
                spacing={1}
                p={{ base: 5, md: 6 }}
                minH={{ base: '170px', md: '200px' }}
                h="full"
                justify="space-between"
              >
                <Box>
                  <Flex align="flex-start" gap={3}>
                    <Box position="relative" flexShrink={0}>
                      {mode === 'dark' && (
                        <Box
                          position="absolute"
                          inset={-3}
                          borderRadius="full"
                          bg={`radial-gradient(circle, ${style.color}, transparent 68%)`}
                          opacity={0.5}
                        />
                      )}
                      <Flex
                        w={12}
                        h={12}
                        align="center"
                        justify="center"
                        position="relative"
                        borderRadius="2xl"
                        bg={iconBoxBg}
                        borderWidth="1px"
                        borderColor={iconBoxBorder}
                        color={style.color}
                      >
                        <Icon as={style.icon} boxSize={6} />
                      </Flex>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        color={theme.textPrimary}
                        letterSpacing="tight"
                      >
                        {feature.label}
                      </Heading>
                      <Text
                        color={theme.textSecondary}
                        mt={1}
                        fontSize="xs"
                        lineHeight="tall"
                      >
                        {feature.description}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                {feature.href ? (
                  <NextLink href={feature.href} passHref>
                    <Button
                      as="a"
                      alignSelf="flex-start"
                      size="sm"
                      fontSize="xs"
                      fontWeight="semibold"
                      px={4}
                      bg="rgba(37, 99, 235, 0.18)"
                      borderWidth="1px"
                      borderColor="rgba(59, 130, 246, 0.45)"
                      color={mode === 'dark' ? 'blue.100' : 'blue.700'}
                      borderRadius="full"
                      rightIcon={<ArrowForwardIcon boxSize={3} />}
                      _hover={{
                        bg: 'rgba(37, 99, 235, 0.32)',
                        borderColor: 'rgba(59, 130, 246, 0.7)',
                        boxShadow: '0 0 18px rgba(59,130,246,.25)',
                      }}
                    >
                      Buka Menu
                    </Button>
                  </NextLink>
                ) : null}
              </Stack>
            </GlassCard>
          );
        })}
      </SimpleGrid>
    </>
  );
}
