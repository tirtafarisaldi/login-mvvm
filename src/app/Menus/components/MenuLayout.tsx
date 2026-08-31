import {
  ArrowBackIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerIcon,
  InfoIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from 'service/auth';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState, type ReactNode } from 'react';
import { useLogout } from '../../../data/repositories/AuthRepositoryImpl';
import { useThemeStore } from '../store/useThemeStore';
import { useThemeColors } from '../store/themeColors';

const menuItems: Array<{
  label: string;
  href?: string;
  icon: typeof ViewIcon;
}> = [
  { label: 'Dashboard', href: '/', icon: ViewIcon },
  { label: 'Inventaris Barang', href: '/inventory', icon: InfoIcon },
  { label: 'Peminjaman', icon: SettingsIcon },
  { label: 'Schedule', href: '/schedule', icon: CalendarIcon },
];

const glowSpots = [
  { top: '18%', left: '12%', size: 420, color: 'rgba(168,85,247,0.14)' },
  { top: '12%', left: '80%', size: 460, color: 'rgba(34,211,238,0.14)' },
  { top: '52%', left: '40%', size: 500, color: 'rgba(59,130,246,0.14)' },
  { top: '76%', left: '82%', size: 440, color: 'rgba(251,146,60,0.10)' },
  { top: '84%', left: '10%', size: 400, color: 'rgba(52,211,153,0.10)' },
  { top: '40%', left: '92%', size: 380, color: 'rgba(244,114,182,0.10)' },
];

export default function MenuLayout({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useLogout();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  const theme = useThemeColors();

  const initials =
    (user?.name ?? 'U')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'U';

  const roleColor =
    mode === 'dark'
      ? isAdmin
        ? '#fde68a'
        : '#7dd3fc'
      : isAdmin
        ? '#b45309'
        : '#0369a1';

  const handleConfirmLogout = async () => {
    setConfirming(true);
    try {
      await logout();
    } catch {
      // Sesi lokal tetap dibersihkan bila API logout tidak dapat diakses.
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    window.dispatchEvent(new Event('auth-change'));
    router.replace('/login');
  };

  return (
    <Flex
      minH="100vh"
      h={{ base: '100dvh', md: '100vh' }}
      direction="column"
      bg={theme.pageBg}
      bgImage={theme.pageBgImage}
      position="relative"
      overflow="hidden"
      p={{ base: 0, md: 10 }}
    >
      {!hasHydrated && (
        <Box
          position="absolute"
          inset={{ base: 0, md: 10 }}
          borderRadius="2xl"
          bg={theme.pageBg}
          zIndex={90}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Flex align="center" justify="center" direction="column" gap={3}>
            <Spinner color="blue.400" />
            <Text color={theme.textMuted} fontSize="sm">
              Memuat…
            </Text>
          </Flex>
        </Box>
      )}
      <Box
        position="absolute"
        inset={{ base: 0, md: 10 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor={theme.panelBorder}
        bg={theme.panelBg}
        boxShadow={theme.panelShadow}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        inset={{ base: 0, md: 10 }}
        borderRadius="2xl"
        pointerEvents="none"
      >
        {mode === 'dark' &&
          glowSpots.map((spot) => (
            <Box
              key={`${spot.top}-${spot.left}`}
              position="absolute"
              top={spot.top}
              left={spot.left}
              w={`${spot.size}px`}
              h={`${spot.size}px`}
              borderRadius="full"
              bg={`radial-gradient(circle, ${spot.color}, transparent 65%)`}
              pointerEvents="none"
            />
          ))}
      </Box>

      <Flex flex="1" minH={0} position="relative" zIndex={1} overflow="hidden">
        <Flex
          direction="column"
          w={{ base: '212px', md: '236px' }}
          h="full"
          py={{ base: 5, md: 6 }}
          px={3}
          color={theme.textPrimary}
          position={{ base: 'absolute', md: 'relative' }}
          top={0}
          left={0}
          zIndex={{ base: 30, md: 1 }}
          transform={{
            base: open ? 'translateX(0)' : 'translateX(-100%)',
            md: 'none',
          }}
          transition={{ base: 'transform 200ms ease', md: 'none' }}
          bg={mode === 'dark' ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.78)'}
          backdropFilter="blur(12px)"
          borderRightWidth="1px"
          borderRightColor={
            mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'
          }
          borderLeftRadius={{ base: 0, md: '2xl' }}
          boxShadow={{ base: '0 0 40px rgba(0,0,0,0.55)', md: 'none' }}
          flexShrink={0}
        >
          <IconButton
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            icon={open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            size="sm"
            position="absolute"
            top="50%"
            right="-16px"
            zIndex={5}
            transform="translateY(-50%)"
            display={{ base: 'inline-flex', md: 'none' }}
            borderRadius="full"
            bg="rgba(59,130,246,0.25)"
            color="white"
            borderWidth="1px"
            borderColor="rgba(59,130,246,0.5)"
            boxShadow="0 0 14px rgba(59,130,246,0.35)"
            _hover={{ bg: 'rgba(59,130,246,0.45)' }}
            onClick={() => setOpen((current) => !current)}
          />

          <Flex align="center" justify="space-between" gap={2} mb={6}>
            <Flex align="center" justify="flex-start" gap={3} minW={0}>
              <Flex
                w={8}
                h={8}
                align="center"
                justify="center"
                borderRadius="md"
                bg="blue.600"
                color="white"
                fontWeight="black"
                fontSize="sm"
                flexShrink={0}
              >
                {user ? initials : '…'}
              </Flex>
              <Box minW={0}>
                {user ? (
                  <>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      letterSpacing="tight"
                      color={theme.textPrimary}
                      noOfLines={1}
                    >
                      {user.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={roleColor}
                      textTransform="capitalize"
                      noOfLines={1}
                    >
                      {user.role}
                    </Text>
                  </>
                ) : (
                  <Text fontSize="sm" color={theme.textMuted}>
                    Memuat…
                  </Text>
                )}
              </Box>
            </Flex>
            <IconButton
              aria-label="Ganti tema"
              icon={mode === 'dark' ? <SunIcon /> : <MoonIcon />}
              variant="ghost"
              size="sm"
              borderRadius="full"
              flexShrink={0}
              color={theme.textSecondary}
              _hover={{ bg: theme.hoverBg, color: theme.textPrimary }}
              onClick={toggleTheme}
            />
          </Flex>

          <Text
            color={theme.textMuted}
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            mb={3}
            px={3}
          >
            Main menu
          </Text>

          <Stack spacing={2}>
            {menuItems.map((item) => {
              const active = item.href === router.pathname;
              const content = (
                <Flex
                  align="center"
                  justify="flex-start"
                  gap={3}
                  px={3}
                  py={2.5}
                  borderRadius="lg"
                  bg={
                    mode === 'dark'
                      ? active
                        ? 'rgba(59, 130, 246, 0.25)'
                        : 'rgba(255,255,255,0.03)'
                      : active
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(15,23,42,0.04)'
                  }
                  boxShadow={
                    active ? 'inset 0 0 0 1px rgba(96,165,250,0.45)' : 'none'
                  }
                  color={
                    active
                      ? theme.textPrimary
                      : mode === 'dark'
                        ? 'whiteAlpha.500'
                        : 'gray.600'
                  }
                  opacity={item.href ? 1 : 0.45}
                  cursor={item.href ? 'pointer' : 'not-allowed'}
                  _hover={
                    item.href
                      ? {
                          bg:
                            mode === 'dark'
                              ? active
                                ? 'rgba(59, 130, 246, 0.35)'
                                : 'rgba(255,255,255,0.06)'
                              : active
                                ? 'rgba(59, 130, 246, 0.22)'
                                : 'rgba(15,23,42,0.08)',
                          color: theme.textPrimary,
                        }
                      : undefined
                  }
                >
                  <Icon as={item.icon} boxSize={5} flexShrink={0} />
                  <Text
                    fontSize="sm"
                    fontWeight={active ? 'semibold' : 'normal'}
                    noOfLines={1}
                  >
                    {item.label}
                  </Text>
                </Flex>
              );
              return item.href ? (
                <NextLink href={item.href} key={item.label} passHref>
                  {content}
                </NextLink>
              ) : (
                <Box key={item.label}>{content}</Box>
              );
            })}
          </Stack>

          <Box mt="auto" pt={10}>
            <Box
              bg={
                mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)'
              }
              borderWidth="1px"
              borderColor={theme.panelBorder}
              borderRadius="xl"
              p={4}
            >
              <Text
                color={theme.textPrimary}
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="widest"
                textTransform="uppercase"
              >
                Studio Pertunjukan
              </Text>
              <Text
                color={theme.textSecondary}
                fontSize="xs"
                mt={2}
                lineHeight="tall"
              >
                Pantau inventaris dan aktivitas studio dari satu tempat.
              </Text>
            </Box>
          </Box>

          <Divider borderColor={theme.panelBorder} my={7} />

          <Flex align="center" justify="space-between" mt={3}>
            <Button
              variant="outline"
              color={mode === 'dark' ? 'red.300' : 'red.600'}
              borderColor={
                mode === 'dark'
                  ? 'rgba(255, 99, 132, 0.4)'
                  : 'rgba(220, 38, 38, 0.5)'
              }
              fontSize="sm"
              _hover={{
                bg:
                  mode === 'dark'
                    ? 'rgba(255, 99, 132, 0.12)'
                    : 'rgba(220, 38, 38, 0.06)',
                color: theme.textPrimary,
                borderColor: 'rgba(220, 38, 38, 0.6)',
              }}
              leftIcon={<ArrowBackIcon />}
              onClick={onOpen}
              w="full"
              borderRadius="full"
              justifyContent="flex-start"
            >
              Keluar
            </Button>
          </Flex>
        </Flex>

        {open && (
          <Box
            position="absolute"
            inset={0}
            zIndex={{ base: 20, md: 0 }}
            bg="rgba(0,0,0,0.60)"
            backdropFilter="blur(2px)"
            display={{ base: 'block', md: 'none' }}
            onClick={() => setOpen(false)}
          />
        )}

        <Box
          flex="1"
          minW={0}
          p={{ base: 5, md: 10 }}
          pb={{ base: 5, md: 10 }}
          overflow="auto"
          bg={mode === 'dark' ? 'rgba(0,0,0,0.40)' : 'rgba(255,255,255,0.55)'}
          backdropFilter="blur(10px)"
          borderRightRadius={{ base: 0, md: '2xl' }}
          color={theme.textPrimary}
          zIndex={1}
          position="relative"
        >
          <IconButton
            aria-label="Buka menu"
            icon={<HamburgerIcon />}
            size="sm"
            display={{ base: 'inline-flex', md: 'none' }}
            mb={5}
            position="sticky"
            top={{ base: 0, md: 0 }}
            zIndex={2}
            borderRadius="full"
            bg="rgba(59,130,246,0.25)"
            color="white"
            borderWidth="1px"
            borderColor="rgba(59,130,246,0.5)"
            boxShadow="0 0 14px rgba(59,130,246,0.35)"
            _hover={{ bg: 'rgba(59,130,246,0.45)' }}
            onClick={() => setOpen(true)}
          />
          {children}
          {isLoading && !confirming && (
            <Box
              position="absolute"
              inset={0}
              zIndex={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={
                mode === 'dark' ? 'rgba(5,6,8,0.55)' : 'rgba(255,255,255,0.55)'
              }
              backdropFilter="blur(2px)"
            >
              <Spinner
                thickness="3px"
                size="lg"
                color={mode === 'dark' ? 'blue.300' : 'blue.500'}
              />
            </Box>
          )}
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="none" isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.65)" backdropFilter="blur(2px)" />
        <ModalContent
          bg={mode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.95)'}
          backdropFilter="blur(16px)"
          borderWidth="1px"
          borderColor={theme.panelBorder}
          color={theme.textPrimary}
          borderRadius="2xl"
          p={2}
          mx={4}
        >
          <ModalHeader fontSize="lg" fontWeight="bold">
            Konfirmasi Keluar
          </ModalHeader>
          <ModalCloseButton
            color={theme.textSecondary}
            _hover={{ color: theme.textPrimary, bg: theme.hoverBg }}
          />
          <ModalBody>
            <Text color={theme.textSecondary} fontSize="sm">
              Apakah kamu yakin ingin keluar dari akun ini?
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              flex={1}
              variant="ghost"
              color={theme.textSecondary}
              borderWidth="1px"
              borderColor={theme.panelBorder}
              borderRadius="full"
              fontSize="sm"
              _hover={{ bg: theme.hoverBg, color: theme.textPrimary }}
              onClick={onClose}
              isDisabled={confirming}
            >
              Batal
            </Button>
            <Button
              flex={1}
              color={mode === 'dark' ? 'red.100' : 'red.600'}
              bg={
                mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.25)'
                  : 'rgba(239, 68, 68, 0.12)'
              }
              borderWidth="1px"
              borderColor="rgba(239, 68, 68, 0.5)"
              backdropFilter="blur(12px)"
              fontSize="sm"
              borderRadius="full"
              _hover={{
                bg: 'rgba(239, 68, 68, 0.45)',
                color: 'white',
                borderColor: 'rgba(239, 68, 68, 0.75)',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
              }}
              _active={{ bg: 'rgba(239, 68, 68, 0.6)' }}
              onClick={handleConfirmLogout}
              isLoading={confirming}
              loadingText="Keluar"
            >
              Ya, Keluar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
