import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../service/auth';
import LoadingPage from './Loading';

export const withProtected = (WrappedComponent: FC<any>) => {
  const WithProtectedComponent = (props: any) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAutoLogin, isAutoLogout } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated && !isAutoLogin && !isAutoLogout) {
        // handle get redirect back to latest page after success login to dashboard
        // get latest page url when user not authenticated and before redirect to login lage
        const { href, pathname } = window.location;
        let loginPathname = '/login';

        if (href && pathname !== '/') {
          loginPathname += `?latest_page=${encodeURIComponent(href)}`;
        }

        router.push(loginPathname);
      } else if (isAutoLogin) {
        Auth.federatedSignIn();
      } else if (isAutoLogout) {
        Auth.signOut();
      }
    }, [isAuthenticated, isAutoLogin, isAutoLogout, isLoading, router]);

    if (isLoading || !isAuthenticated || isAutoLogin || isAutoLogout) {
      return <LoadingPage />;
    }

    // handle get redirect back to latest page after success login to dashboard
    // get latest page url from local storage
    const getLatestPageUrl = localStorage.getItem('bms_latest_page');

    if (isAuthenticated && !isLoading && getLatestPageUrl) {
      // remove local storage after success login and redirect to latest page url
      localStorage.removeItem('bms_latest_page');
      router.push(getLatestPageUrl);
    }

    return <WrappedComponent {...props} />;
  };

  return WithProtectedComponent;
};

export const withLoginPageHandler = (WrappedComponent: FC) => {
  const WithLoginPageHandlerComponent = (props: any) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, isAutoLogin, isAutoLogout } = useAuth();
    const latestPage: any = router?.query?.latest_page;

    useEffect(() => {
      if (!router.isReady) return;
      if (!isLoading && isAuthenticated && !isAutoLogin && !isAutoLogout) {
        // Redirect to latest page if provided
        if (latestPage) {
          router.push(latestPage);
        } else {
          router.push('/');
        }
      } else if (isAutoLogin) {
        Auth.federatedSignIn();
      } else if (isAutoLogout) {
        Auth.signOut();
      }
    }, [isAuthenticated, isAutoLogin, isAutoLogout, isLoading, latestPage, router]);

    if (isLoading || isAuthenticated || isAutoLogin || isAutoLogout) {
      return <LoadingPage />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithLoginPageHandlerComponent;
};
