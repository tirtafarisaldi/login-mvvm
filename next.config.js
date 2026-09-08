module.exports = {
  env: {
    restapiEndpoint: process.env.RESTAPI_ENDPOINT,
    restapiKey: process.env.RESTAPI_APIKEY,
    nextApiPublicDomain: process.env.NEXT_PUBLIC_API_DOMAIN,
    nextApiRefreshTokenPath: process.env.NEXT_PUBLIC_REFRESH_TOKEN_PATH,
    nextTokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY,
    nextTokenSalt: process.env.NEXT_PUBLIC_TOKEN_SALT,
  },
};
