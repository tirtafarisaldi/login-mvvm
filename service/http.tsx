import axios, { type AxiosRequestConfig } from 'axios';
// http instance used across the app; tokens stored in localStorage under 'accessToken'
import { QueryClient } from 'react-query';

type RetryableRequest = {
  _retry?: boolean;
  _skipAuth?: boolean;
  headers?: Record<string, string>;
  url?: string;
};

const refreshTokenPath = process.env.nextApiRefreshTokenPath ?? '/token';
let refreshRequest: Promise<unknown> | null = null;

const getAccessToken = (payload: unknown): string | null => {
  if (typeof payload !== 'object' || payload === null) return null;
  const data = payload as Record<string, unknown>;
  const token = data.accessToken ?? data.access_token ?? data.token;
  if (typeof token === 'string' && token.length > 0) return token;

  return typeof data.data === 'object' && data.data !== null
    ? getAccessToken(data.data)
    : null;
};

const isExpiredAccessTokenError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const response = (
    error as { response?: { status?: unknown; data?: unknown } }
  ).response;
  if (!response) return false;

  if (response.status === 401) return true;
  return (
    response.status === 403 &&
    typeof response.data === 'object' &&
    response.data !== null &&
    (response.data as { msg?: unknown }).msg === 'Access token has expired'
  );
};

const notifyAutoLogout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  delete http.defaults.headers.common['Authorization'];
  window.dispatchEvent(new Event('auth-auto-logout'));
};

const http = axios.create({
  baseURL: `${process.env.nextApiPublicDomain}/api`,
  headers: {
    'Content-type': 'application/json',
  },
  // Refresh token yang HTTP-only tidak dapat dibaca JavaScript; browser akan
  // mengirimkannya otomatis pada request ini.
  withCredentials: true,
});

// Client terpisah agar refresh tidak pernah mewarisi interceptor atau header
// Authorization access token yang sudah kedaluwarsa.
const refreshHttp = axios.create({
  baseURL: `${process.env.nextApiPublicDomain}/api`,
  headers: { 'Content-type': 'application/json' },
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  if (config.headers && !(config as RetryableRequest)._skipAuth) {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch (e) {
      // Ignore storage errors silently
    }
  }
  return config;
});

http.interceptors.response.use(
  // Do something with response success
  (response) => {
    // save token if exist
    // if (
    //   response &&
    //   response.data &&
    //   response.data.data &&
    //   response.data.data.token
    // ) {
    //   localStorage.setItem('token', encrypt(response.data.data.token));
    // }
    return response.data;
  },
  // Do something with response error
  async (error) => {
    const isExpiredAccessToken = isExpiredAccessTokenError(error);
    const originalRequest = (error?.config ?? error?.response?.config) as
      RetryableRequest | undefined;
    if (
      isExpiredAccessToken &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== refreshTokenPath
    ) {
      originalRequest._retry = true;

      try {
        refreshRequest ??= refreshHttp
          .get(refreshTokenPath)
          .then((response) => response.data);
        const refreshResponse = await refreshRequest;
        const accessToken = getAccessToken(refreshResponse);

        if (!accessToken) throw new Error('Access token tidak ditemukan.');

        localStorage.setItem('accessToken', accessToken);
        http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return http(originalRequest as AxiosRequestConfig);
      } catch {
        notifyAutoLogout();
      } finally {
        refreshRequest = null;
      }
    }
    // if (window && window.growl) {
    //   // see primereact growl for documentations
    //   // https://primefaces.org/primereact/showcase/#/growl
    //   const errorData = error && error.response && error.response.data;
    //   const errorCode = errorData && errorData.code;
    //   const errorMessage = errorData && errorData.message;
    //   window.growl.current.show({
    //     life: 6000,
    //     severity: 'error',
    //     summary: `Error: ${errorCode}`,
    //     detail: <div>{errorMessage}</div>
    //   });
    // }
    // const errorCode = error && error.response && error.response.data && error.response.data.code;
    // if (errorCode == 401) {
    //   Router.push('/signin');
    // }
    // console.error(error.response);
    return Promise.reject(error.response ?? error);
  }
);

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

export default http;
