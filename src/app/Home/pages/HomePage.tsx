import {
  ArrowForwardIcon,
  CalendarIcon,
  InfoIcon,
  RepeatIcon,
  SmallAddIcon,
  StarIcon,
  TimeIcon,
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
  { icon: InfoIcon, color: '#93c5fd' },
  { icon: RepeatIcon, color: '#60a5fa' },
  { icon: CalendarIcon, color: '#3b82f6' },
  { icon: ViewIcon, color: '#7dd3fc' },
];

export default function HomePage() {
  const { features } = useHomeViewModel();
  const available = features.filter((feature) => feature.href).length;
  const soon = features.length - available;
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const stats: Array<{
    label: string;
    value: number;
    icon: typeof InfoIcon;
    color: string;
  }> = [
    {
      label: 'Total Modul',
      value: features.length,
      icon: SmallAddIcon,
      color: '#93c5fd',
    },
    {
      label: 'Akses Cepat',
      value: available,
      icon: StarIcon,
      color: '#60a5fa',
    },
    {
      label: 'Segera Hadir',
      value: soon,
      icon: TimeIcon,
      color: '#3b82f6',
    },
  ];

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
          <Text
            color="blue.400"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={3}
          >
            Dashboard
          </Text>
          <Heading
            as="h1"
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="shorter"
            bgGradient="linear(to-r, white 28%, blue.300)"
            bgClip="text"
          >
            Studio Pertunjukan
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

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {features.map((feature, index) => {
          const style = featureStyles[index % featureStyles.length];
          return (
            <GlassCard key={feature.id} radius="3rem" depth={34}>
              <Stack
                spacing={5}
                p={6}
                minH="200px"
                h="full"
                justify="space-between"
              >
                <Flex align="center" justify="space-between">
                  <Flex
                    w={12}
                    h={12}
                    align="center"
                    justify="center"
                    borderRadius="2xl"
                    bg="rgba(255,255,255,0.08)"
                    borderWidth="1px"
                    borderColor="rgba(255,255,255,0.14)"
                    color={style.color}
                    backdropFilter="blur(12px)"
                    boxShadow="inset 0 1px 0 rgba(255,255,255,0.1)"
                  >
                    <Icon as={style.icon} boxSize={6} />
                  </Flex>
                </Flex>
                <Box>
                  <Heading size="sm" color="white" letterSpacing="tight">
                    {feature.label}
                  </Heading>
                  <Text color="whiteAlpha.600" mt={2} fontSize="xs">
                    {feature.description}
                  </Text>
                </Box>
                {feature.href ? (
                  <NextLink href={feature.href} passHref>
                    <Button
                      as="a"
                      alignSelf="flex-start"
                      size="md"
                      fontSize="sm"
                      bg="blue.600"
                      color="white"
                      borderRadius="full"
                      rightIcon={<ArrowForwardIcon />}
                      _hover={{
                        bg: 'blue.500',
                        boxShadow: '0 0 24px rgba(59,130,246,.4)',
                      }}
                    >
                      Buka menu
                    </Button>
                  </NextLink>
                ) : (
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.400"
                    bg="rgba(255,255,255,0.05)"
                    borderWidth="1px"
                    borderColor="rgba(255,255,255,0.08)"
                    borderRadius="full"
                    px={4}
                    py={2}
                    w="max-content"
                  >
                    Segera hadir
                  </Text>
                )}
              </Stack>
            </GlassCard>
          );
        })}
      </SimpleGrid>
    </MenuLayout>
  );
}
