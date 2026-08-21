import axios from 'axios';
// http instance used across the app; tokens stored in localStorage under 'accessToken'
import { QueryClient } from 'react-query';

const http = axios.create({
  baseURL: `${process.env.nextApiPublicDomain}/api`,
  headers: {
    'Content-type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  if (config.headers) {
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
  (error) => {
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
    return Promise.reject(error.response);
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
