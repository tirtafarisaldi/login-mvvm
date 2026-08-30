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
import MenuLayout from '../../Menus/components/MenuLayout';
import { useHomeViewModel } from '../viewModels/HomeViewModel';

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

export default function HomePage() {
  const { features, stats, statsLoading } = useHomeViewModel();
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <MenuLayout>
      <Flex
        justify="space-between"
        align="flex-end"
        gap={5}
        mb={8}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Heading
            as="h1"
            size={{ base: '2xl', md: '4xl' }}
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="shorter"
            color="white"
            fontFamily="sans-serif"
          >
            Overview
          </Heading>
          <Text color="whiteAlpha.600" mt={4} fontSize="sm" maxW="lg">
            Pilih menu untuk mulai mengelola aktivitas laboratorium, inventaris,
            peminjaman, dan jadwal ruangan.
          </Text>
        </Box>
        <GlassCard radius="full" depth={10} maxTilt={6}>
          <Flex align="center" gap={3} px={6} py={2.5}>
            <Box
              w={2}
              h={2}
              borderRadius="full"
              bg="blue.400"
              boxShadow="0 0 12px rgba(59,130,246,.9)"
            />
            <Text fontSize="xs" color="whiteAlpha.800">
              {today}
            </Text>
          </Flex>
        </GlassCard>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6} mb={8}>
        {stats.map((stat, index) => {
          const style = statStyles[index % statStyles.length];
          return (
            <GlassCard key={stat.id} radius="2xl" depth={20}>
              <Flex align="center" gap={5} p={6}>
                <Box position="relative" flexShrink={0}>
                  <Box
                    position="absolute"
                    inset={-3}
                    borderRadius="full"
                    bg={style.color}
                    opacity={0.14}
                    filter="blur(18px)"
                  />
                  <Flex
                    w={12}
                    h={12}
                    align="center"
                    justify="center"
                    position="relative"
                    borderRadius="2xl"
                    bg="rgba(255,255,255,0.06)"
                    borderWidth="1px"
                    borderColor="rgba(255,255,255,0.12)"
                    color={style.color}
                  >
                    <Icon as={style.icon} boxSize={6} />
                  </Flex>
                </Box>
                <Box>
                  <Text
                    color="whiteAlpha.500"
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                  >
                    {stat.label}
                  </Text>
                  <Text
                    color="white"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="black"
                    letterSpacing="tight"
                    lineHeight="shorter"
                    mt={0.5}
                  >
                    {statsLoading ? '…' : stat.value.toLocaleString('id-ID')}
                  </Text>
                  <Text color="whiteAlpha.600" fontSize="xs" mt={1}>
                    {stat.hint}
                  </Text>
                </Box>
              </Flex>
            </GlassCard>
          );
        })}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={6}>
        {features.map((feature, index) => {
          const style = featureStyles[index % featureStyles.length];
          return (
            <GlassCard key={feature.id} radius="2xl" depth={26}>
              <Stack
                spacing={4}
                p={6}
                minH="220px"
                h="full"
                justify="space-between"
              >
                <Box>
                  <Flex align="flex-start" gap={4}>
                    <Box position="relative" flexShrink={0}>
                      <Box
                        position="absolute"
                        inset={-3}
                        borderRadius="full"
                        bg={style.color}
                        opacity={0.14}
                        filter="blur(18px)"
                      />
                      <Flex
                        w={12}
                        h={12}
                        align="center"
                        justify="center"
                        position="relative"
                        borderRadius="2xl"
                        bg="rgba(255,255,255,0.06)"
                        borderWidth="1px"
                        borderColor="rgba(255,255,255,0.12)"
                        color={style.color}
                      >
                        <Icon as={style.icon} boxSize={6} />
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="sm" color="white" letterSpacing="tight">
                        {feature.label}
                      </Heading>
                      <Text
                        color="whiteAlpha.600"
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
                      color="blue.100"
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
    </MenuLayout>
  );
}
