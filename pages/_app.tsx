import 'styles/tailwind.css';
import 'styles/index.css';
import 'styles/filter-date-datepicker.css';

import { StrictMode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'styles/theme';
import { AuthProvider, useAuth } from 'service/auth';
import MenuLayout from 'src/app/Menus/components/MenuLayout';

import type { DehydratedState } from 'react-query';
import { Hydrate, QueryClientProvider } from 'react-query';
import { client } from 'service/http';

import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(
  () => import('react-query/devtools').then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

const menuRoutes = ['/', '/inventory', '/booking', '/schedule'];

type AppPropsWithDehydratedState = AppProps & {
  pageProps: AppProps['pageProps'] & { dehydratedState?: DehydratedState };
};

function AppContent({ Component, pageProps }: AppPropsWithDehydratedState) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    const onStart = () => setIsRouteChanging(true);
    const onDone = () => setIsRouteChanging(false);
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onDone);
    router.events.on('routeChangeError', onDone);
    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onDone);
      router.events.off('routeChangeError', onDone);
    };
  }, [router.events]);

  const isProtectedRoute = menuRoutes.includes(router.pathname);

  useEffect(() => {
    if (!isLoading && isProtectedRoute && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, isProtectedRoute, router]);

  const isMenuRoute = isProtectedRoute && isAuthenticated && !isLoading;

  if (isMenuRoute) {
    return (
      <StrictMode>
        <MenuLayout isLoading={isRouteChanging}>
          <Component {...pageProps} />
        </MenuLayout>
      </StrictMode>
    );
  }

  if (isProtectedRoute) {
    return (
      <Flex
        minH="100vh"
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
            Memuat...
          </Text>
          <Text color="whiteAlpha.500" fontSize="xs">
            Mohon tunggu sebentar
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <StrictMode>
      <Component {...pageProps} />
    </StrictMode>
  );
}

function MyApp({ Component, pageProps }: AppPropsWithDehydratedState) {
  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps?.dehydratedState}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <title>Studio Pertunjukan</title>
            </Head>
            <AppContent Component={Component} pageProps={pageProps} />
          </AuthProvider>
        </ChakraProvider>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
