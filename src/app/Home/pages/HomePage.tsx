import {
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircleFill,
  BsXCircleFill,
  FaHandshake,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiInbox,
  FiPackage,
  FiUsers,
  type AppIcon,
} from '../../Menus/store/appIcons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from 'service/auth';
import GlassCard from '../../../../components/Cards/GlassCard/GlassCard';
import {
  useHomeViewModel,
  type BookingStatItem,
  type DashboardNotification,
} from '../viewModels/HomeViewModel';
import { useThemeStore } from '../../Menus/store/useThemeStore';
import { useThemeColors } from '../../Menus/store/themeColors';

const featureStyles: Array<{ icon: AppIcon; color: string }> = [
  { icon: FiPackage, color: '#60a5fa' },
  { icon: FaHandshake, color: '#a78bfa' },
  { icon: FiCalendar, color: '#22d3ee' },
  { icon: FiUsers, color: '#34d399' },
];

const statStyles: Array<{ icon: AppIcon; color: string }> = [
  { icon: FiPackage, color: '#93c5fd' },
  { icon: FaHandshake, color: '#fbbf24' },
  { icon: FiCalendar, color: '#60a5fa' },
  { icon: FiInbox, color: '#34d399' },
];

const TONE_ICON: Record<
  DashboardNotification['tone'],
  { icon: AppIcon; color: string }
> = {
  info: { icon: BsInfoCircleFill, color: 'blue.500' },
  success: { icon: BsCheckCircleFill, color: 'green.500' },
  warning: { icon: BsExclamationTriangleFill, color: 'yellow.500' },
  danger: { icon: BsXCircleFill, color: 'red.500' },
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const buildDonut = (segments: BookingStatItem[]): string => {
  const total = segments.reduce((sum, item) => sum + item.count, 0) || 1;
  let cursor = 0;
  const stops = segments.map((item) => {
    const from = (cursor / total) * 360;
    cursor += item.count;
    const to = (cursor / total) * 360;
    return `${item.color} ${from}deg ${to}deg`;
  });
  return `conic-gradient(${stops.join(', ')})`;
};

export default function HomePage() {
  const { user } = useAuth();
  const {
    features,
    stats,
    notifications,
    roomSchedule,
    inventoryAlerts,
    bookingStats,
    totalBookings,
    statsLoading,
  } = useHomeViewModel();
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const today = dateFormatter.format(new Date());
  const roleLabelMap: Record<string, string> = {
    admin: 'Admin Dashboard',
    staff: 'Staff Dashboard',
    dosen: 'Dosen Dashboard',
    mahasiswa: 'Mahasiswa Dashboard',
  };
  const roleLabel =
    (user?.role ? roleLabelMap[user.role] : undefined) ?? 'User Dashboard';
  const isAdmin = user?.role === 'admin';

  const iconBoxBg =
    mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';
  const iconBoxBorder =
    mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';
  const trackBg =
    mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)';
  const donutHoleBg = mode === 'dark' ? 'rgba(10,12,18,0.92)' : 'white';

  const pendingCount = bookingStats
    .filter((item) => item.status === 'pending' || item.status === 'reviewing')
    .reduce((sum, item) => sum + item.count, 0);
  const maxStatCount =
    bookingStats.reduce((max, item) => Math.max(max, item.count), 0) || 1;

  const toneStyles = () => ({
    bg: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.035)',
    border: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)',
  });

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
          <Flex align="center" gap={3} mb={3} wrap="wrap">
            <Tag
              size="sm"
              borderRadius="full"
              px={3}
              py={1}
              bg={isAdmin ? 'blue.500' : 'purple.500'}
              color="white"
              fontWeight="bold"
            >
              {roleLabel}
            </Tag>
            {isAdmin && pendingCount > 0 && (
              <Tag
                size="sm"
                borderRadius="full"
                px={3}
                py={1}
                bg={mode === 'dark' ? 'rgba(245,158,11,0.15)' : 'orange.50'}
                color={mode === 'dark' ? 'orange.200' : 'orange.700'}
              >
                {pendingCount} request menunggu
              </Tag>
            )}
          </Flex>
          <Heading
            as="h1"
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="shorter"
            color={theme.textPrimary}
            fontFamily="poppins"
          >
            Selamat datang, {user?.name || 'Pengguna'}
          </Heading>
          <Text color={theme.textSecondary} mt={2} fontSize="sm" maxW="lg">
            {isAdmin
              ? 'Pantau statistik peminjaman, jadwal ruangan, dan inventaris studio dalam satu tampilan terintegrasi.'
              : 'Ikuti status peminjamanmu, jadwal aktif, dan inventaris yang tersedia hari ini.'}
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
              flexShrink={0}
              borderRadius="full"
              bg="blue.400"
              boxShadow="0 0 12px rgba(59,130,246,.9)"
            />
            <Text fontSize="xs" color={theme.textSecondary} whiteSpace="nowrap">
              {today}
            </Text>
          </Flex>
        </GlassCard>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4} mb={8}>
        {stats.map((stat, index) => {
          const style = statStyles[index % statStyles.length];
          return (
            <GlassCard key={stat.id} radius="2xl" depth={20}>
              <Flex align="center" gap={4} p={{ base: 4, md: 5 }}>
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
                    w={{ base: 11, md: 12 }}
                    h={{ base: 11, md: 12 }}
                    align="center"
                    justify="center"
                    position="relative"
                    borderRadius="2xl"
                    bg={iconBoxBg}
                    borderWidth="1px"
                    borderColor={iconBoxBorder}
                    color={style.color}
                  >
                    <Icon as={style.icon} boxSize={{ base: 4, md: 5 }} />
                  </Flex>
                </Box>
                <Box minW={0} flex={1}>
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
                    mt={1}
                  >
                    {statsLoading ? '…' : stat.value.toLocaleString('id-ID')}
                  </Text>
                  <Text color={theme.textSecondary} fontSize="xs" mt={1}>
                    {stat.hint}
                  </Text>
                </Box>
              </Flex>
            </GlassCard>
          );
        })}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 12 }} spacing={6}>
        <Box gridColumn={{ xl: 'span 7' }}>
          <GlassCard radius="2xl" depth={26}>
            <Box p={{ base: 5, md: 6 }}>
              <Flex justify="space-between" align="center" mb={5} gap={3}>
                <Box>
                  <Heading as="h2" size="md" color={theme.textPrimary}>
                    Statistik Peminjaman
                  </Heading>
                  <Text color={theme.textSecondary} fontSize="xs" mt={1}>
                    {isAdmin
                      ? 'Semua permintaan peminjaman berdasarkan statusnya'
                      : 'Peminjaman Anda berdasarkan status'}
                  </Text>
                </Box>
                <Badge
                  borderRadius="full"
                  px={3}
                  py={1}
                  bg={mode === 'dark' ? 'rgba(59,130,246,0.18)' : 'blue.500'}
                  color={mode === 'dark' ? 'blue.200' : 'white'}
                >
                  {totalBookings} total
                </Badge>
              </Flex>

              {bookingStats.length > 0 ? (
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align={{ base: 'center', md: 'stretch' }}
                  gap={8}
                >
                  <Flex align="center" justify="center" flexShrink={0}>
                    <Box
                      position="relative"
                      w="172px"
                      h="172px"
                      borderRadius="full"
                      style={{ background: buildDonut(bookingStats) }}
                    >
                      <Flex
                        position="absolute"
                        inset={0}
                        align="center"
                        justify="center"
                      >
                        <Box
                          w="118px"
                          h="118px"
                          borderRadius="full"
                          bg={donutHoleBg}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box textAlign="center">
                            <Text
                              fontSize="3xl"
                              fontWeight="black"
                              color={theme.textPrimary}
                              lineHeight="shorter"
                            >
                              {totalBookings}
                            </Text>
                            <Text
                              fontSize="xs"
                              color={theme.textMuted}
                              fontWeight="semibold"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              Total
                            </Text>
                          </Box>
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>

                  <Stack spacing={4} flex={1} justify="center" w="full">
                    {bookingStats.map((item) => (
                      <Box key={item.status}>
                        <Flex justify="space-between" align="center" mb={1.5}>
                          <Flex align="center" gap={2}>
                            <Box
                              w={2.5}
                              h={2.5}
                              borderRadius="full"
                              bg={item.color}
                              boxShadow={`0 0 8px ${item.color}`}
                            />
                            <Text
                              fontSize="sm"
                              color={theme.textSecondary}
                              fontWeight="medium"
                            >
                              {item.label}
                            </Text>
                          </Flex>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={theme.textPrimary}
                          >
                            {item.count}
                          </Text>
                        </Flex>
                        <Box h="6px" borderRadius="full" bg={trackBg}>
                          <Box
                            h="full"
                            borderRadius="full"
                            width={`${Math.round(
                              (item.count / maxStatCount) * 100
                            )}%`}
                            bg={`linear-gradient(90deg, ${item.color}66, ${item.color})`}
                            transition="width 0.6s ease"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Flex>
              ) : (
                <Text fontSize="sm" color={theme.textSecondary}>
                  {isAdmin
                    ? 'Belum ada data peminjaman yang tercatat.'
                    : 'Anda belum memiliki peminjaman.'}
                </Text>
              )}
            </Box>
          </GlassCard>
        </Box>

        <Box gridColumn={{ xl: 'span 5' }}>
          <GlassCard radius="2xl" depth={26}>
            <Box p={{ base: 5, md: 6 }}>
              <Flex align="center" justify="space-between" mb={5}>
                <Box>
                  <Heading as="h2" size="md" color={theme.textPrimary}>
                    {isAdmin ? 'Notifikasi Admin' : 'Update Status'}
                  </Heading>
                  <Text color={theme.textSecondary} fontSize="xs" mt={1}>
                    {isAdmin
                      ? 'Request peminjaman yang masuk'
                      : 'Perkembangan terbaru peminjaman Anda'}
                  </Text>
                </Box>
                <Box
                  w={2.5}
                  h={2.5}
                  borderRadius="full"
                  bg={isAdmin ? 'blue.400' : 'green.400'}
                  boxShadow={
                    mode === 'dark'
                      ? isAdmin
                        ? '0 0 10px rgba(59,130,246,0.8)'
                        : '0 0 10px rgba(52,211,153,0.8)'
                      : 'none'
                  }
                />
              </Flex>

              <VStack spacing={3} align="stretch">
                {isAdmin && pendingCount > 0 && (
                  <Box
                    p={4}
                    borderRadius="2xl"
                    borderWidth="1px"
                    borderColor="rgba(59,130,246,0.35)"
                    bg={
                      mode === 'dark'
                        ? 'rgba(59,130,246,0.12)'
                        : 'rgba(59,130,246,0.08)'
                    }
                  >
                    <Flex align="center" gap={4}>
                      <Flex
                        w={12}
                        h={12}
                        flexShrink={0}
                        align="center"
                        justify="center"
                        borderRadius="xl"
                        bg="rgba(59,130,246,0.2)"
                        color="blue.300"
                      >
                        <FiInbox size={20} />
                      </Flex>
                      <Box flex={1}>
                        <Text
                          fontSize="2xl"
                          fontWeight="black"
                          color={theme.textPrimary}
                          lineHeight="shorter"
                        >
                          {pendingCount}
                        </Text>
                        <Text fontSize="xs" color={theme.textSecondary}>
                          permintaan menunggu persetujuan
                        </Text>
                      </Box>
                      <NextLink href="/booking" passHref>
                        <Button
                          as="a"
                          size="sm"
                          variant="ghost"
                          borderRadius="full"
                          colorScheme="blue"
                          rightIcon={<FiArrowRight size={14} />}
                        >
                          Buka
                        </Button>
                      </NextLink>
                    </Flex>
                  </Box>
                )}

                {notifications.length > 0 ? (
                  notifications.map((notification) => {
                    const tone = TONE_ICON[notification.tone];
                    const border =
                      notification.tone === 'danger'
                        ? 'rgba(239,68,68,0.35)'
                        : notification.tone === 'warning'
                          ? 'rgba(245,158,11,0.35)'
                          : notification.tone === 'success'
                            ? 'rgba(52,211,153,0.35)'
                            : 'rgba(59,130,246,0.35)';
                    const styles = toneStyles();
                    return (
                      <Flex
                        key={notification.id}
                        align="flex-start"
                        gap={3}
                        p={3}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={border}
                        bg={styles.bg}
                      >
                        <Flex
                          w={9}
                          h={9}
                          flexShrink={0}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={
                            mode === 'dark'
                              ? iconBoxBg
                              : tone.color === 'blue.500'
                                ? 'blue.50'
                                : tone.color === 'green.500'
                                  ? 'green.50'
                                  : tone.color === 'yellow.500'
                                    ? 'yellow.50'
                                    : 'red.50'
                          }
                          borderWidth="1px"
                          borderColor={
                            mode === 'dark' ? iconBoxBorder : 'transparent'
                          }
                          color={tone.color}
                        >
                          <Icon as={tone.icon} boxSize={4} />
                        </Flex>
                        <Box flex={1} minW={0}>
                          <Text fontWeight="bold" color={theme.textPrimary}>
                            {notification.title}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={theme.textSecondary}
                            mt={0.5}
                            noOfLines={2}
                          >
                            {notification.description}
                          </Text>
                          <Text fontSize="xs" color={theme.textMuted} mt={1.5}>
                            {notification.meta}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })
                ) : (
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Tidak ada pemberitahuan terbaru.
                  </Text>
                )}
              </VStack>
            </Box>
          </GlassCard>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 12 }} spacing={6} mt={6}>
        <Box gridColumn={{ xl: 'span 7' }}>
          <GlassCard radius="2xl" depth={26}>
            <Box p={{ base: 5, md: 6 }}>
              <Flex justify="space-between" align="center" mb={5} gap={3}>
                <Box>
                  <Heading as="h2" size="md" color={theme.textPrimary}>
                    Jadwal Ruangan
                  </Heading>
                  <Text color={theme.textSecondary} fontSize="xs" mt={1}>
                    Agenda penggunaan ruangan terdekat
                  </Text>
                </Box>
                <Badge
                  borderRadius="full"
                  px={3}
                  py={1}
                  bg={mode === 'dark' ? 'rgba(20,184,166,0.18)' : 'teal.500'}
                  color={mode === 'dark' ? 'teal.200' : 'white'}
                >
                  Agenda mendatang
                </Badge>
              </Flex>

              <VStack spacing={3} align="stretch" maxH="360px" overflowY="auto">
                {roomSchedule.length > 0 ? (
                  roomSchedule.map((item) => (
                    <Flex
                      key={item.id}
                      align="center"
                      gap={3}
                      p={3}
                      borderRadius="xl"
                      bg={
                        mode === 'dark'
                          ? 'whiteAlpha.50'
                          : 'rgba(15,23,42,0.03)'
                      }
                    >
                      <Flex
                        direction="column"
                        align="center"
                        flexShrink={0}
                        w={14}
                      >
                        <Flex
                          w={9}
                          h={9}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={
                            mode === 'dark'
                              ? 'rgba(20,184,166,0.18)'
                              : 'teal.100'
                          }
                          color={mode === 'dark' ? 'teal.300' : 'teal.700'}
                        >
                          <FiClock size={18} />
                        </Flex>
                      </Flex>
                      <Box flex={1} minW={0}>
                        <Text
                          fontWeight="semibold"
                          color={theme.textPrimary}
                          noOfLines={1}
                        >
                          {item.label}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={theme.textSecondary}
                          mt={0.5}
                        >
                          {item.meta}
                        </Text>
                      </Box>
                    </Flex>
                  ))
                ) : (
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Tidak ada jadwal ruangan berikutnya.
                  </Text>
                )}
              </VStack>
            </Box>
          </GlassCard>
        </Box>

        <Box gridColumn={{ xl: 'span 5' }}>
          <GlassCard radius="2xl" depth={26}>
            <Box p={{ base: 5, md: 6 }}>
              <Flex justify="space-between" align="center" mb={5}>
                <Box>
                  <Heading as="h2" size="md" color={theme.textPrimary}>
                    Status Inventaris
                  </Heading>
                  <Text color={theme.textSecondary} fontSize="xs" mt={1}>
                    Peralatan yang sedang dipinjam
                  </Text>
                </Box>
                <Badge
                  borderRadius="full"
                  px={3}
                  py={1}
                  bg={mode === 'dark' ? 'rgba(99,102,241,0.18)' : 'indigo.500'}
                  color={mode === 'dark' ? 'indigo.200' : 'white'}
                >
                  Dipinjam
                </Badge>
              </Flex>

              <VStack spacing={3} align="stretch" maxH="360px" overflowY="auto">
                {inventoryAlerts.length > 0 ? (
                  inventoryAlerts.map((item) => (
                    <Flex
                      key={item.id}
                      align="center"
                      gap={3}
                      p={3}
                      borderRadius="xl"
                      bg={
                        mode === 'dark'
                          ? 'whiteAlpha.50'
                          : 'rgba(15,23,42,0.03)'
                      }
                    >
                      <Flex
                        w={9}
                        h={9}
                        align="center"
                        justify="center"
                        flexShrink={0}
                        borderRadius="lg"
                        bg={
                          mode === 'dark'
                            ? 'rgba(99,102,241,0.18)'
                            : 'indigo.100'
                        }
                        color={mode === 'dark' ? 'indigo.300' : 'indigo.700'}
                      >
                        <FiPackage size={18} />
                      </Flex>
                      <Box flex={1} minW={0}>
                        <Text
                          fontWeight="semibold"
                          color={theme.textPrimary}
                          noOfLines={1}
                        >
                          {item.label}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={theme.textSecondary}
                          mt={0.5}
                        >
                          {item.value} • Dipinjam
                        </Text>
                      </Box>
                      <Badge
                        borderRadius="full"
                        bg={
                          mode === 'dark'
                            ? 'rgba(99,102,241,0.22)'
                            : 'indigo.500'
                        }
                        color={mode === 'dark' ? 'indigo.200' : 'white'}
                        flexShrink={0}
                      >
                        Dipinjam
                      </Badge>
                    </Flex>
                  ))
                ) : (
                  <Text fontSize="sm" color={theme.textSecondary}>
                    Semua peralatan tersedia. Tidak ada yang sedang dipinjam.
                  </Text>
                )}
              </VStack>
            </Box>
          </GlassCard>
        </Box>
      </SimpleGrid>

      <Box mt={8}>
        <Heading as="h2" size="md" mb={4} color={theme.textPrimary}>
          Menu cepat
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
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
                        rightIcon={<FiArrowRight size={14} />}
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
      </Box>
    </>
  );
}
