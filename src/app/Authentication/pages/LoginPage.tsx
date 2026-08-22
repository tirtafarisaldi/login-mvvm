import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
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
import { useState, type FormEvent } from 'react';
import { useLoginViewModel } from '../viewModels/LoginViewModel';
import { useRegisterViewModel } from '../viewModels/RegisterViewModel';

const MotionBox = motion(Box);

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const pageBg =
    'radial-gradient(circle at 86% 10%, rgba(14, 165, 233, 0.16), transparent 26%), radial-gradient(circle at 12% 88%, rgba(14, 165, 233, 0.12), transparent 32%), radial-gradient(circle at 52% 48%, rgba(8, 47, 73, 0.32), transparent 54%), linear-gradient(135deg, #020617 0%, #030b1c 48%, #00030a 100%)';
  const cardBg = 'rgba(8, 29, 52, 0.72)';
  const inputBg = 'rgba(255,255,255,0.08)';
  const textColor = 'whiteAlpha.900';
  const mutedText = 'cyan.100';

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
      minH="100vh"
      bgImage={pageBg}
      bgColor="#020617"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 12 }}
    >
      <Box
        position="absolute"
        left={0}
        top={0}
        h="100%"
        w={{ base: '100%', lg: '52%' }}
        bgImage="linear-gradient(90deg, rgba(2, 6, 23, 0.18), rgba(2, 6, 23, 0.88) 92%), linear-gradient(180deg, rgba(8, 47, 73, 0.22), rgba(2, 6, 23, 0.68)), url('/img/studio-pertunjukan.png')"
        bgSize="cover"
        bgPos="left center"
        opacity={0.5}
        zIndex={0}
      />
      <MotionBox
        position="absolute"
        top="-120px"
        left="-80px"
        w="420px"
        h="420px"
        borderRadius="50%"
        bg="cyan.400"
        opacity={0.12}
        filter="blur(90px)"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <MotionBox
        position="absolute"
        bottom="-100px"
        right="-120px"
        w="520px"
        h="520px"
        borderRadius="50%"
        bg="cyan.600"
        opacity={0.12}
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
          <Text
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            color="cyan.300"
            mb={4}
          >
            Laboratorium Studio Pertunjukan
          </Text>

          <Heading
            as="h1"
            size="2xl"
            lineHeight="1.05"
            maxW="3xl"
            mb={6}
            color={textColor}
          >
            Kelola aktivitas studio dengan mudah.
          </Heading>

          <Text fontSize="lg" maxW="2xl" color="whiteAlpha.700">
            Temukan informasi peralatan, lakukan peminjaman, cek jadwal, dan
            akses berbagai layanan Laboratorium Studio Pertunjukan dengan lebih
            cepat dan mudah.
          </Text>

          <Stack spacing={4} mt={10} maxW="2xl">
            <Flex gap={3} align="center">
              <Box w={3} h={3} borderRadius="full" bg="cyan.300" />
              <Text fontWeight="medium" color="whiteAlpha.800">
                List peralatan studio lengkap
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box w={3} h={3} borderRadius="full" bg="cyan.300" />
              <Text fontWeight="medium" color="whiteAlpha.800">
                Proses peminjaman inventaris yang cepat
              </Text>
            </Flex>
            <Flex gap={3} align="center">
              <Box w={3} h={3} borderRadius="full" bg="cyan.300" />
              <Text fontWeight="medium" color="whiteAlpha.800">
                Jadwal ruangan dan latihan terintegrasi
              </Text>
            </Flex>
          </Stack>
        </MotionBox>

        <MotionBox
          flex="0 0 380px"
          bg={cardBg}
          borderRadius="3xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 40px 80px rgba(0, 0, 0, 0.28)"
          border="1px solid rgba(255,255,255,0.22)"
          backdropFilter="blur(24px)"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          maxH={{ base: 'auto', md: '700px' }}
        >
          <Stack spacing={4} textAlign="center" mb={6}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="widest"
              color="cyan.200"
            >
              Selamat datang di Studio Pertunjukan
            </Text>
            <Heading size="lg" color={textColor}>
              {isRegister ? 'Buat akun baru' : 'Masuk untuk melanjutkan'}
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.700">
              {isRegister
                ? 'Daftarkan akun Anda untuk mulai mengakses fitur studio.'
                : 'Gunakan akun Anda untuk mengakses informasi peralatan, peminjaman, jadwal, dan layanan laboratorium.'}
            </Text>
          </Stack>

          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {isRegister && (
                <FormControl isRequired>
                  <FormLabel color={mutedText}>Nama</FormLabel>
                  <Input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    bg={inputBg}
                    border="none"
                    borderRadius="2xl"
                    _focus={{ boxShadow: 'none', bg: inputBg }}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    color="white"
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel color={mutedText}>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="nama@laboratorium.id"
                  bg={inputBg}
                  border="none"
                  borderRadius="2xl"
                  _focus={{ boxShadow: 'none', bg: inputBg }}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  color={'white'}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={mutedText}>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    bg={inputBg}
                    border="none"
                    borderRadius="2xl"
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
                  <FormLabel color={mutedText}>Konfirmasi Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ulangi password"
                      bg={inputBg}
                      border="none"
                      borderRadius="2xl"
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
                  fontSize="sm"
                  color={mutedText}
                  _hover={{ color: 'cyan.200' }}
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
                size="lg"
                borderRadius="2xl"
                bg="cyan.300"
                color="gray.900"
                _hover={{ bg: 'cyan.200' }}
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
