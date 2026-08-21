export type State = {
  loadedInIframe?: boolean;
  iframeReferrerHostname?: string;
  isReferrerHostnameWhitelisted?: boolean;
};

export type Actions = {
  setLoadedInIframe: (type: boolean) => void;
  setIframeReferrerHostname: (url: string) => void;
  setIsReferrerHostnameWhitelisted: (type: boolean) => void;
};
