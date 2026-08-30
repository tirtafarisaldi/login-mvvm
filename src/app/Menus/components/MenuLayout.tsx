import {
  ArrowBackIcon,
  CalendarIcon,
  InfoIcon,
  SettingsIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useLogout } from '../../../data/repositories/AuthRepositoryImpl';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: ViewIcon },
  { label: 'Inventaris Barang', href: '/inventory', icon: InfoIcon },
  { label: 'Peminjaman', icon: SettingsIcon },
  { label: 'Jadwal Ruangan', href: '/calendar', icon: CalendarIcon },
];

const noiseBackground = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const glowSpots = [
  { top: '18%', left: '12%', size: 420, color: 'rgba(168,85,247,0.08)' },
  { top: '12%', left: '80%', size: 460, color: 'rgba(34,211,238,0.08)' },
  { top: '52%', left: '40%', size: 500, color: 'rgba(59,130,246,0.08)' },
  { top: '76%', left: '82%', size: 440, color: 'rgba(251,146,60,0.06)' },
  { top: '84%', left: '10%', size: 400, color: 'rgba(52,211,153,0.06)' },
  { top: '40%', left: '92%', size: 380, color: 'rgba(244,114,182,0.06)' },
];

export default function MenuLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useLogout();
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Sesi lokal tetap dibersihkan bila API logout tidak dapat diakses.
    }
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-change'));
    router.replace('/login');
  };

  return (
    <Flex
      minH="100vh"
      bg="#050506"
      bgImage="radial-gradient(ellipse 60% 42% at 50% -8%, rgba(94,106,210,0.11), transparent 62%), radial-gradient(ellipse 45% 30% at 100% 100%, rgba(94,106,210,0.04), transparent 60%), radial-gradient(circle at 65% 40%, rgba(30,64,175,0.04), transparent 55%), linear-gradient(180deg, #07080A 0%, #050506 50%, #040506 100%)"
      position="relative"
      overflow="hidden"
      p={{ base: 0, md: 9 }}
    >
      <Box
        position="absolute"
        inset={{ base: 0, md: 9 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.12)"
        bg="rgba(255,255,255,0.02)"
        backdropFilter="blur(18px)"
        boxShadow="0 0 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.04)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        inset={{ base: 0, md: 9 }}
        borderRadius="2xl"
        pointerEvents="none"
      >
        {glowSpots.map((spot) => (
          <Box
            key={`${spot.top}-${spot.left}`}
            position="absolute"
            top={spot.top}
            left={spot.left}
            w={`${spot.size}px`}
            h={`${spot.size}px`}
            borderRadius="full"
            bg={`radial-gradient(circle, ${spot.color}, transparent 65%)`}
            pointerEvents="auto"
            transition="filter .3s ease"
            _hover={{
              filter: 'brightness(1.7)',
            }}
          />
        ))}
      </Box>
      {/* <Box
        position="absolute"
        top="9%"
        right="5%"
        w="280px"
        h="190px"
        opacity={0.14}
        bgImage="linear-gradient(rgba(103, 232, 249, .6) 1px, transparent 1px), linear-gradient(90deg, rgba(103, 232, 249, .6) 1px, transparent 1px)"
        bgSize="20px 20px"
        sx={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}
        pointerEvents="none"
      /> */}
      <Box
        w={{ base: '72px', md: '236px' }}
        minH={{ base: '100vh', md: 'calc(100vh - 72px)' }}
        bg="rgba(255,255,255,0.03)"
        color="white"
        p={{ base: 3, md: 5 }}
        borderWidth={{ base: 0, md: '1px' }}
        borderColor="rgba(255,255,255,0.10)"
        borderRightWidth={{ base: '1px', md: '1px' }}
        borderRightColor="rgba(255,255,255,0.10)"
        borderRadius={{ base: 0, md: '2xl' }}
        boxShadow="none"
        backdropFilter="blur(8px)"
        zIndex={1}
      >
        <Flex align="center" gap={3} mb={10} px={{ base: 0, md: 1 }}>
          <Flex
            w={8}
            h={8}
            align="center"
            justify="center"
            borderRadius="full"
            bg="blue.600"
            color="white"
            fontWeight="black"
            fontSize="sm"
          >
            SP
          </Flex>
          <Box display={{ base: 'none', md: 'block' }}>
            <Text
              fontWeight="bold"
              fontSize="sm"
              letterSpacing="tight"
              color="white"
            >
              Studio Pertunjukan
            </Text>
            <Text fontSize="xs" color="whiteAlpha.500">
              Workspace
            </Text>
          </Box>
        </Flex>
        <Text
          display={{ base: 'none', md: 'block' }}
          color="whiteAlpha.500"
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
                gap={3}
                px={3}
                py={2.5}
                borderRadius="lg"
                bg={active ? 'rgba(255,255,255,0.08)' : 'transparent'}
                boxShadow={
                  active ? 'inset 0 0 0 1px rgba(255,255,255,0.10)' : 'none'
                }
                color={active ? 'white' : 'whiteAlpha.500'}
                opacity={item.href ? 1 : 0.55}
                cursor={item.href ? 'pointer' : 'not-allowed'}
                transition="all .18s ease"
                _hover={
                  item.href
                    ? {
                        bg: 'rgba(255,255,255,0.08)',
                        color: 'white',
                      }
                    : undefined
                }
              >
                <Icon as={item.icon} boxSize={5} />
                <Text
                  display={{ base: 'none', md: 'block' }}
                  fontSize="sm"
                  fontWeight={active ? 'semibold' : 'normal'}
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
        <Box display={{ base: 'none', md: 'block' }} mt="auto" pt={12}>
          <Box
            bg="rgba(255,255,255,0.05)"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.08)"
            borderRadius="xl"
            p={4}
            backdropFilter="blur(8px)"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.04)"
          >
            <Text
              color="white"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Studio Pertunjukan
            </Text>
            <Text color="whiteAlpha.600" fontSize="xs" mt={2} lineHeight="tall">
              Pantau inventaris dan aktivitas studio dari satu tempat.
            </Text>
          </Box>
        </Box>
        <Divider
          display={{ base: 'none', md: 'block' }}
          borderColor="rgba(255,255,255,0.09)"
          my={7}
        />
        <Flex
          align="center"
          justify={{ base: 'center', md: 'space-between' }}
          mt={{ base: 10, md: 0 }}
        >
          <Button
            variant="ghost"
            color="whiteAlpha.500"
            _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'white' }}
            leftIcon={<ArrowBackIcon />}
            onClick={handleLogout}
            w="full"
            borderRadius="full"
            justifyContent={{ base: 'center', md: 'flex-start' }}
          >
            <Text display={{ base: 'none', md: 'block' }}>Keluar</Text>
          </Button>
        </Flex>
      </Box>
      <Box
        flex="1"
        minW={0}
        p={{ base: 5, md: 8 }}
        overflowX="auto"
        color="white"
        zIndex={1}
      >
        {children}
      </Box>
      <Box
        position="absolute"
        inset={0}
        bgImage={noiseBackground}
        bgSize="180px 180px"
        opacity={0.08}
        pointerEvents="none"
        zIndex={2}
      />
    </Flex>
  );
}
