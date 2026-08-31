import 'styles/tailwind.css';
import 'styles/index.css';
import 'styles/filter-date-datepicker.css';

import { StrictMode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';
import theme from 'styles/theme';
import { AuthProvider } from 'service/auth';
import MenuLayout from 'src/app/Menus/components/MenuLayout';

import type { DehydratedState } from 'react-query';
import { Hydrate, QueryClientProvider } from 'react-query';
import { client } from 'service/http';

import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(
  () => import('react-query/devtools').then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

const menuRoutes = ['/', '/inventory', '/schedule'];

type AppPropsWithDehydratedState = AppProps & {
  pageProps: AppProps['pageProps'] & { dehydratedState?: DehydratedState };
};

function MyApp({ Component, pageProps }: AppPropsWithDehydratedState) {
  const router = useRouter();
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

  const isMenuRoute = menuRoutes.includes(router.pathname);

  const content = isMenuRoute ? (
    <MenuLayout isLoading={isRouteChanging}>
      <Component {...pageProps} />
    </MenuLayout>
  ) : (
    <Component {...pageProps} />
  );

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
            <StrictMode>{content}</StrictMode>
          </AuthProvider>
        </ChakraProvider>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
