type TokenPayload = Record<string, unknown>;

const isPayload = (value: unknown): value is TokenPayload =>
  typeof value === 'object' && value !== null;

const readToken = (payload: TokenPayload): string | null => {
  const token = payload.accessToken ?? payload.access_token ?? payload.token;
  return typeof token === 'string' && token.length > 0 ? token : null;
};

/**
 * `http` returns the response body directly, while some API responses still
 * wrap that body in `data`. Support both forms during the API transition.
 */
export const getAccessToken = (response: unknown): string | null => {
  if (!isPayload(response)) return null;

  return (
    readToken(response) ??
    (isPayload(response.data) ? readToken(response.data) : null)
  );
};
