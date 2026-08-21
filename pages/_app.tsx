import '@fortawesome/fontawesome-free/css/all.min.css';
import 'styles/tailwind.css';
import 'styles/index.css';
import 'styles/filter-date-datepicker.css';

import React, { ReactNode, useEffect } from 'react';
import type { FC } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'styles/theme';
import { NextComponentType, NextPageContext } from 'next/types';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from 'service/auth';
import SidebarLayout from 'layouts';

import type { DehydratedState } from 'react-query';
import { dehydrate, Hydrate, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { client } from 'service/http';

type AppPropsWithLayout<P> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, any, any> & {
    layout: any;
  };
  dehydratedState?: DehydratedState;
};

function MyApp({
  Component,
  pageProps,
}: AppPropsWithLayout<{ dehydratedState: DehydratedState }>) {
  const { pathname } = useRouter();
  const Layout =
    Component.layout ||
    (({ children }: { children: ReactNode }) => <>{children}</>);

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
              <title>Login Page MVVM</title>
            </Head>
            <React.StrictMode>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </React.StrictMode>
          </AuthProvider>
        </ChakraProvider>
        <ReactQueryDevtools />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
