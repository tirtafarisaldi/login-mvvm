import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState, type FocusEvent, type FormEvent } from 'react';
import { useLoginViewModel } from '../viewModels/LoginViewModel';
import { useRegisterViewModel } from '../viewModels/RegisterViewModel';

const MotionBox = motion(Box);

function StudioOrnaments() {
  return (
    <Box
      aria-hidden="true"
      position="absolute"
      top={{ base: 4, md: 6 }}
      left={{ base: 4, md: 90 }}
      zIndex={2}
    >
      <Image
        src="/img/logommb.png"
        alt="Logo MMB"
        h={{ base: '30px', md: '40px' }}
        w="auto"
        opacity={0.85}
        _hover={{ opacity: 1 }}
        transition="opacity 0.3s"
      />
    </Box>
  );
}

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

function StudioSpotlights({ paused }: { paused: boolean }) {
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
          style={{
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      ))}
    </Box>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleAuthFormFocus = () => setIsTyping(true);

  const handleAuthFormBlur = (event: FocusEvent<HTMLElement>) => {
    const target = event.currentTarget;
    requestAnimationFrame(() => {
      if (!target.contains(document.activeElement)) {
        setIsTyping(false);
      }
    });
  };
  const router = useRouter();
  const toast = useToast();

  const pageBg =
    'linear-gradient(to right, #0b1026 0%, #0a1026 38%, #04060d 80%)';
  const cardBg = 'rgba(255,255,255,0.045)';
  const inputBg = 'rgba(255,255,255,0.06)';
  const textColor = 'whiteAlpha.900';
  const mutedText = 'blue.200';

  const onLoginSuccess = () => {
    router.push('/');
  };

  const onRegisterSuccess = () => {
    toast({
      status: 'success',
      title: 'Registrasi berhasil',
      description: 'Akun Anda berhasil dibuat. Silakan lanjutkan.',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
    setIsRegister(false);
    setName('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const onAuthFailure = (title: string, errorMessage: string) => {
    toast({
      status: 'error',
      title,
      description: errorMessage,
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const { loginByEmailCallback, loading: loginLoading } = useLoginViewModel({
    onSuccess: onLoginSuccess,
    onFailure: (errorMessage) => onAuthFailure('Gagal login', errorMessage),
  });
  const { registerByEmailCallback, loading: registerLoading } =
    useRegisterViewModel({
      onSuccess: onRegisterSuccess,
      onFailure: (errorMessage) =>
        onAuthFailure('Gagal registrasi', errorMessage),
    });

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    if (!email || !password || (isRegister && !name)) {
      toast({
        status: 'warning',
        title: isRegister
          ? 'Nama, email, dan password wajib diisi'
          : 'Email dan password wajib diisi',
        duration: 2500,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (isRegister) {
      if (!confirmPassword) {
        toast({
          status: 'warning',
          title: 'Konfirmasi password wajib diisi',
          duration: 2500,
          isClosable: true,
          position: 'top',
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          status: 'warning',
          title: 'Password tidak cocok',
          description: 'Konfirmasi password harus sama dengan password Anda.',
          duration: 2500,
          isClosable: true,
          position: 'top',
        });
        return;
      }

      await registerByEmailCallback(name, email, password, confirmPassword);
      return;
    }

    await loginByEmailCallback(email, password);
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
      <StudioOrnaments />
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
      <StudioSpotlights paused={isTyping} />
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

      <Flex
        w="full"
        maxW="1200px"
        mx="auto"
        align="center"
        justify="center"
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 10, lg: 12 }}
        zIndex={1}
        marginTop={{ base: '50px', lg: '0px' }}
      >
        <MotionBox
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          color="white"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* <Flex align="center" gap={3} mb={4}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              letterSpacing="widest"
              textTransform="uppercase"
              color="blue.400"
            >
              Laboratorium Studio Pertunjukan
            </Text>
          </Flex> */}

          <Heading
            as="h1"
            fontSize={{ base: '4xl', sm: '5xl', md: '7xl', xl: '8xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="1.05"
            maxW="3xl"
            mb={3}
          >
            <MotionBox
              as="span"
              display="inline-block"
              bgGradient="linear(to-b, white 16%, blue.100 54%, blue.300 100%)"
              bgClip="text"
              pr={2}
              pb={4}
              // animate={{
              //   textShadow: [
              //     '0 0 10px rgba(103, 232, 249, 0.16)',
              //     '0 0 20px rgba(103, 232, 249, 0.52), 0 0 56px rgba(6, 182, 212, 0.28)',
              //     '0 0 10px rgba(103, 232, 249, 0.16)',
              //   ],
              //   filter: ['brightness(1)', 'brightness(1.18)', 'brightness(1)'],
              // }}
              // transition={{
              //   duration: 5.5,
              //   repeat: Infinity,
              //   ease: 'easeInOut',
              // }}
            >
              Studio Pertunjukan
            </MotionBox>
          </Heading>

          <Text fontSize="md" maxW="2xl" color="whiteAlpha.700">
            Temukan informasi peralatan, lakukan booking, cek jadwal, dan
            akses berbagai layanan Laboratorium Studio Pertunjukan dengan lebih
            cepat dan mudah.
          </Text>
        </MotionBox>

        <MotionBox
          flex={{ base: '1 1 auto', lg: '0 0 380px' }}
          w={{ base: 'full', lg: 'auto' }}
          maxW="380px"
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 40px 80px rgba(0, 0, 0, 0.28)"
          border="1px solid rgba(255,255,255,0.1)"
          backdropFilter="blur(12px)"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          maxH={{ base: 'auto', md: '700px' }}
        >
          <Stack spacing={4} textAlign="center" mb={6}>
            <Text fontSize="xs" fontWeight="semibold" color="whiteAlpha.700">
              Selamat datang di Studio Pertunjukan
            </Text>
            <Heading size="lg" color={textColor}>
              {isRegister ? 'Buat akun baru' : 'Masuk untuk melanjutkan'}
            </Heading>
            <Text fontSize="xs" color="whiteAlpha.700">
              {isRegister
                ? 'Daftarkan akun Anda untuk mulai mengakses fitur studio.'
                : 'Gunakan akun Anda untuk mengakses informasi peralatan, booking, jadwal, dan layanan laboratorium.'}
            </Text>
          </Stack>

          <Box
            as="form"
            onSubmit={handleSubmit}
            onFocus={handleAuthFormFocus}
            onBlurCapture={handleAuthFormBlur}
          >
            <Stack spacing={4}>
              {isRegister && (
                <FormControl isRequired>
                  <FormLabel color={mutedText} fontSize="xs">
                    Nama
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    bg={inputBg}
                    border="none"
                    borderRadius="2xl"
                    fontSize="sm"
                    _focus={{ boxShadow: 'none', bg: inputBg }}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    color="white"
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel color={mutedText} fontSize="xs">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  placeholder="nama@laboratorium.id"
                  bg={inputBg}
                  border="none"
                  borderRadius="2xl"
                  fontSize="sm"
                  _focus={{ boxShadow: 'none', bg: inputBg }}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  color={'white'}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={mutedText} fontSize="xs">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    bg={inputBg}
                    border="none"
                    borderRadius="2xl"
                    fontSize="sm"
                    _focus={{ boxShadow: 'none', bg: inputBg }}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    color={'white'}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {isRegister && (
                <FormControl>
                  <FormLabel color={mutedText} fontSize="xs">
                    Konfirmasi Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      bg={inputBg}
                      border="none"
                      borderRadius="2xl"
                      fontSize="sm"
                      _focus={{ boxShadow: 'none', bg: inputBg }}

                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      color={'white'}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? 'Sembunyikan konfirmasi password'
                            : 'Tampilkan konfirmasi password'
                        }
                        icon={
                          showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                        }
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}

              <Flex justify="flex-end" align="center">
                <Text
                  as="button"
                  type="button"
                  fontSize="xs"
                  color={mutedText}
                  _hover={{ color: 'blue.300' }}
                  cursor="pointer"
                  onClick={toggleMode}
                  textAlign="right"
                  bg="transparent"
                  border="none"
                  p={0}
                >
                  {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
                </Text>
              </Flex>

              <Button
                type="submit"
                w="full"
                size="md"
                fontSize="sm"
                borderRadius="full"
                color="white"
                bg="rgba(37, 99, 235, 0.25)"
                borderWidth="1px"
                borderColor="rgba(59, 130, 246, 0.5)"
                backdropFilter="blur(12px)"
                _hover={{
                  bg: 'rgba(37, 99, 235, 0.45)',
                  borderColor: 'rgba(59, 130, 246, 0.75)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
                _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
                isLoading={isRegister ? registerLoading : loginLoading}
                loadingText={isRegister ? 'Mendaftar' : 'Masuk'}
              >
                {isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang'}
              </Button>
            </Stack>
          </Box>
        </MotionBox>
      </Flex>
    </Flex>
  );
}
