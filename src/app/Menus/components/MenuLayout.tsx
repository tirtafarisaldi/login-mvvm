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
  { label: 'Jadwal Ruangan', icon: CalendarIcon },
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
      bg="#08080b"
      bgImage="radial-gradient(ellipse at 18% 0%, rgba(255,255,255,.05), transparent 55%), radial-gradient(ellipse at 82% 96%, rgba(255,255,255,.04), transparent 58%), radial-gradient(ellipse at 100% 10%, rgba(255,255,255,.03), transparent 45%), linear-gradient(180deg, #101014 0%, #0b0b0e 50%, #09090c 100%)"
      position="relative"
      overflow="hidden"
      p={{ base: 0, md: 5 }}
    >
      <Box
        position="absolute"
        inset={{ base: 0, md: 5 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        pointerEvents="none"
      />
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
        minH={{ base: '100vh', md: 'calc(100vh - 40px)' }}
        bg="rgba(8, 10, 14, 0.6)"
        color="white"
        p={{ base: 3, md: 5 }}
        borderRightWidth={{ base: '1px', md: 0 }}
        borderRightColor="rgba(255, 255, 255, 0.08)"
        borderRadius={{ base: 0, md: '2xl' }}
        boxShadow="0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
        backdropFilter="blur(20px)"
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
            <Text fontWeight="bold" fontSize="sm" letterSpacing="tight">
              Studio Pertunjukan
            </Text>
            <Text fontSize="xs" color="whiteAlpha.400">
              Workspace
            </Text>
          </Box>
        </Flex>
        <Text
          display={{ base: 'none', md: 'block' }}
          color="whiteAlpha.400"
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
                bg={active ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}
                boxShadow={
                  active ? 'inset 0 0 0 1px rgba(255,255,255,0.14)' : 'none'
                }
                color={active ? 'white' : 'whiteAlpha.500'}
                opacity={item.href ? 1 : 0.55}
                cursor={item.href ? 'pointer' : 'not-allowed'}
                transition="all .18s ease"
                _hover={
                  item.href
                    ? { bg: 'whiteAlpha.100', color: 'white' }
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
            bg="rgba(255, 255, 255, 0.03)"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.08)"
            borderRadius="xl"
            p={4}
            backdropFilter="blur(18px)"
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
          borderColor="whiteAlpha.100"
          my={7}
        />
        <Button
          mt={{ base: 10, md: 0 }}
          variant="ghost"
          color="whiteAlpha.500"
          _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
          leftIcon={<ArrowBackIcon />}
          onClick={handleLogout}
          w="full"
          borderRadius="full"
          justifyContent={{ base: 'center', md: 'flex-start' }}
        >
          <Text display={{ base: 'none', md: 'block' }}>Keluar</Text>
        </Button>
      </Box>
      <Box
        flex="1"
        minW={0}
        p={{ base: 5, md: 7 }}
        overflowX="auto"
        color="white"
        zIndex={1}
      >
        {children}
      </Box>
    </Flex>
  );
}
