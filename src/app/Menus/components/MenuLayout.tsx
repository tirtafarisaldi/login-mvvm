import {
  ArrowBackIcon,
  CalendarIcon,
  InfoIcon,
  SettingsIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { Box, Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: ViewIcon },
  { label: 'Inventaris Barang', href: '/inventory', icon: InfoIcon },
  { label: 'Peminjaman', icon: SettingsIcon },
  { label: 'Jadwal Ruangan', icon: CalendarIcon },
];

export default function MenuLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-change'));
    router.replace('/login');
  };

  return (
    <Flex
      minH="100vh"
      bg="#020617"
      bgImage="radial-gradient(circle at 86% 10%, rgba(14, 165, 233, 0.16), transparent 26%), radial-gradient(circle at 12% 88%, rgba(14, 165, 233, 0.12), transparent 32%), radial-gradient(circle at 52% 48%, rgba(8, 47, 73, 0.32), transparent 54%), linear-gradient(135deg, #020617 0%, #030b1c 48%, #00030a 100%)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-180px"
        right="-130px"
        w="440px"
        h="440px"
        borderRadius="full"
        borderWidth="1px"
        borderColor="rgba(103, 232, 249, 0.22)"
        boxShadow="0 0 80px rgba(14, 165, 233, 0.12), inset 0 0 60px rgba(14, 165, 233, 0.05)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-220px"
        left="20%"
        w="380px"
        h="380px"
        borderRadius="full"
        borderWidth="1px"
        borderColor="rgba(103, 232, 249, 0.12)"
        transform="rotate(25deg)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="14%"
        right="8%"
        w="160px"
        h="100px"
        opacity={0.24}
        bgImage="radial-gradient(rgba(103, 232, 249, 0.7) 1px, transparent 1px)"
        bgSize="14px 14px"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="85%"
        right="70%"
        w="160px"
        h="100px"
        opacity={0.24}
        bgImage="radial-gradient(rgba(103, 232, 249, 0.7) 1px, transparent 1px)"
        bgSize="14px 14px"
        pointerEvents="none"
      />
      <Box
        w={{ base: '76px', md: '280px' }}
        bg="whiteAlpha.050"
        color="white"
        p={{ base: 3, md: 6 }}
        borderRightWidth="1px"
        borderColor="rgba(103, 232, 249, 0.26)"
        backdropFilter="blur(24px)"
        zIndex={1}
      >
        <Flex align="center" gap={3} mb={10}>
          {/* <Icon as={ViewIcon} boxSize={7} color="pink.300" /> */}
          <Box display={{ base: 'none', md: 'block' }}>
            <Text fontWeight="bold">Studio Pertunjukan</Text>
            <Text fontSize="xs" color="purple.200">
              D3 Teknologi Multimedia Broadcasting
            </Text>
          </Box>
        </Flex>
        <Stack spacing={2}>
          {menuItems.map((item) => {
            const active = item.href === router.pathname;
            const content = (
              <Flex
                align="center"
                gap={3}
                px={3}
                py={3}
                borderRadius="xl"
                bg={active ? 'cyan.400' : 'transparent'}
                boxShadow={
                  active ? '0 8px 24px rgba(34, 211, 238, 0.14)' : 'none'
                }
                color={active ? 'gray.900' : 'whiteAlpha.700'}
                opacity={item.href ? 1 : 0.55}
                cursor={item.href ? 'pointer' : 'not-allowed'}
              >
                <Icon as={item.icon} boxSize={5} />
                <Text
                  display={{ base: 'none', md: 'block' }}
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
        <Button
          mt={10}
          variant="ghost"
          colorScheme="pink"
          leftIcon={<ArrowBackIcon />}
          onClick={handleLogout}
          w="full"
          justifyContent={{ base: 'center', md: 'flex-start' }}
        >
          <Text display={{ base: 'none', md: 'block' }}>Keluar</Text>
        </Button>
      </Box>
      <Box
        flex="1"
        p={{ base: 5, md: 10 }}
        overflowX="auto"
        color="white"
        zIndex={1}
      >
        {children}
      </Box>
    </Flex>
  );
}
