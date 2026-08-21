import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { Actions, State } from './types';

const useLoadedInIframeStore = create(
  persist(
    immer<State & Actions>((set) => ({
      loadedInIframe: undefined,
      iframeReferrerHostname: undefined,
      isReferrerHostnameWhitelisted: false,
      setLoadedInIframe: (status) =>
        set((draft) => {
          draft.loadedInIframe = status;
        }),
      setIframeReferrerHostname: (url) =>
        set((draft) => {
          draft.iframeReferrerHostname = url;
        }),
      setIsReferrerHostnameWhitelisted: (isWhitelisted) =>
        set((draft) => {
          draft.isReferrerHostnameWhitelisted = isWhitelisted;
        })
    })),
    {
      name: 'iframe-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

export default useLoadedInIframeStore;
