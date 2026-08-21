import { useCallback, useRef } from 'react';

export const useDebounce = (): ((
  callback: (...args: any) => void,
  debounce?: number,
  ...args: any
) => NodeJS.Timeout) => {
  const time = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (callback: (...args: any) => void, debounce = 400, ...args: any) => {
      if (time.current) {
        clearTimeout(time.current);
        time.current = null;
      }
      time.current = setTimeout(callback, debounce, args);
      return time.current;
    },
    [time]
  );
};

export const useInterval = (): ((
  callback: (...args: any) => void,
  debounce?: number,
  ...args: any
) => NodeJS.Timeout) => {
  const time = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (callback, debounce = 400, ...args) => {
      if (time.current) {
        clearInterval(time.current);
        time.current = null;
      }
      time.current = setInterval(callback, debounce, args);
      return time.current;
    },
    [time]
  );
};
