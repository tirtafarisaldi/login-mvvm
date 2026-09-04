import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import { useLoginViewModel } from '../viewModels/LoginViewModel';

const MotionBox = motion(Box);

const SPOTLIGHTS = [
  {
    left: '6%',
    width: '11vw',
    duration: 9,
    delay: 0,
    opacity: 0.28,
    color: 'rgba(125, 211, 252, 0.32)',
  },
  {
    left: '31%',
    width: '10vw',
    duration: 11,
    delay: 1.4,
    opacity: 0.24,
    color: 'rgba(196, 181, 253, 0.3)',
  },
  {
    left: '60%',
    width: '11vw',
    duration: 10,
    delay: 0.7,
    opacity: 0.26,
    color: 'rgba(103, 232, 249, 0.26)',
  },
  {
    left: '80%',
    width: '10vw',
    duration: 9.5,
    delay: 2.1,
    opacity: 0.22,
    color: 'rgba(125, 211, 252, 0.28)',
  },
];

function StudioSpotlights() {
  return (
    <Box
      aria-hidden="true"
      position="absolute"
      inset={0}
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
    >
      {SPOTLIGHTS.map((spotlight, index) => (
        <Box
          key={index}
          position="absolute"
          top="-20%"
          left={spotlight.left}
          w={spotlight.width}
          h="150%"
          bg={`linear-gradient(to bottom, ${spotlight.color} 0%, transparent 80%)`}
          clipPath="polygon(43% 0, 57% 0, 100% 100%, 0 100%)"
          opacity={spotlight.opacity}
          transformOrigin="top center"
          animation={`spotlightSway ${spotlight.duration}s ease-in-out ${spotlight.delay}s infinite`}
        />
      ))}
    </Box>
  );
}

export default function Login() {
  const router = useRouter();
  const toast = useToast();

  const pageBg =
    'linear-gradient(to right, #0b1026 0%, #0a1026 38%, #04060d 80%)';

  const { loginBySSOCallback, loading: loginLoading } = useLoginViewModel({
    onSuccess: () => {
      router.push('/');
    },
    onFailure: (errorMessage) => {
      toast({
        status: 'error',
        title: 'Gagal login',
        description: errorMessage,
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
  });

  const [redirecting, setRedirecting] = useState(false);

  const handleSsoLogin = (event?: FormEvent) => {
    event?.preventDefault();
    setRedirecting(true);
    loginBySSOCallback();
  };

  return (
    <Flex
      data-theme="dark"
      minH="100vh"
      bgImage={pageBg}
      bgColor="#070b15"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
      fontFamily="'Poppins', sans-serif"
    >
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
        focusable="false"
      >
        <filter id="neutralize-purple" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.90 0 0 0 0
                    0.18 0.88 0.12 0 0
                    0 0 0.92 0 0
                    0 0 0 1 0"
          />
          <feColorMatrix type="saturate" values="0.85" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.05" intercept="0.01" />
            <feFuncG type="linear" slope="1.05" intercept="0.01" />
            <feFuncB type="linear" slope="1.05" intercept="0.01" />
          </feComponentTransfer>
        </filter>
      </svg>
      <Box
        position="absolute"
        left={0}
        top={0}
        h="100%"
        w="full"
        overflow="hidden"
      >
        <Image
          src="/img/studio-pertunjukan.jpg"
          alt="Panggung Studio Pertunjukan"
          position="absolute"
          left={0}
          top={0}
          h="100%"
          w="120%"
          objectFit="cover"
          objectPosition="35% center"
          filter="url(#neutralize-purple)"
          opacity={0.6}
        />
        <Box
          position="absolute"
          inset={0}
          w="full"
          h="full"
          bgImage="linear-gradient(90deg, rgba(2, 6, 23, 0.14), rgba(2, 6, 23, 0.6) 92%), linear-gradient(180deg, rgba(8, 47, 73, 0.18), rgba(2, 6, 23, 0.5))"
        />
      </Box>
      <StudioSpotlights />
      <MotionBox
        position="absolute"
        top="-120px"
        left="-80px"
        w="420px"
        h="420px"
        borderRadius="50%"
        bg="blue.500"
        opacity={0.1}
        filter="blur(90px)"
        animation="gentleBounce 14s ease-in-out infinite"
      />
      <MotionBox
        position="absolute"
        bottom="-100px"
        right="-120px"
        w="520px"
        h="520px"
        borderRadius="50%"
        bg="blue.700"
        opacity={0.1}
        filter="blur(100px)"
      />

      <MotionBox
        w="full"
        maxW="520px"
        mx="auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        mt={{ base: '60px', md: '0' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/img/logommb.png"
          alt="Logo MMB"
          h={{ base: '44px', md: '52px' }}
          w="auto"
          mb={10}
          opacity={0.9}
        />

        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          fontWeight="medium"
          letterSpacing="0.2em"
          textTransform="uppercase"
          color="gray.300"
          mb={3}
        >
          Selamat datang di
        </Text>

        <Heading
          as="h1"
          fontSize={{ base: '5xl', sm: '6xl', md: '7xl', lg: '8xl' }}
          fontWeight="black"
          letterSpacing="-0.03em"
          lineHeight="1.15"
          textAlign="center"
          pb={2}
          mb={5}
          bgGradient="linear(to-b, white 10%, blue.300 100%)"
          bgClip="text"
        >
          Studio{' '}
          <Box as="span" display="block">
            Pertunjukan
          </Box>
        </Heading>

        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.300"
          textAlign="center"
          maxW={{ base: '260px', md: '300px' }}
          lineHeight="1.7"
          mb={10}
          opacity={0.65}
        >
          Pusat informasi peralatan, booking, jadwal, dan seluruh layanan
          laboratorium dalam satu genggaman.
        </Text>

        <Box
          as="form"
          onSubmit={handleSsoLogin}
          w="full"
          maxW={{ base: '220px', md: '260px' }}
        >
          <Button
            type="submit"
            w="full"
            size="md"
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="semibold"
            letterSpacing="0.05em"
            borderRadius="full"
            color="white"
            bg="rgba(37, 99, 235, 0.3)"
            borderWidth="1px"
            borderColor="rgba(59, 130, 246, 0.45)"
            _hover={{
              bg: 'rgba(37, 99, 235, 0.5)',
              borderColor: 'rgba(59, 130, 246, 0.7)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)',
            }}
            _active={{ bg: 'rgba(37, 99, 235, 0.65)' }}
            isLoading={loginLoading}
            loadingText="Mengarahkan ke SSO..."
          >
            Masuk dengan SSO
          </Button>
        </Box>
      </MotionBox>

      {redirecting && (
        <Flex
          position="fixed"
          inset={0}
          zIndex={9999}
          bg="rgba(7, 11, 21, 0.92)"
          backdropFilter="blur(8px)"
          align="center"
          justify="center"
          direction="column"
          gap={5}
        >
          <Spinner size="xl" color="blue.300" thickness="3px" />
          <VStack spacing={1}>
            <Text color="white" fontSize="md" fontWeight="semibold">
              Mengarahkan ke SSO...
            </Text>
            <Text color="whiteAlpha.500" fontSize="xs">
              Mohon tunggu sebentar
            </Text>
          </VStack>
        </Flex>
      )}
    </Flex>
  );
}
