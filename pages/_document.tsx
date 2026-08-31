import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/img/Logo_PENS_putih.png" />
      <link rel="apple-touch-icon" href="/img/Logo_PENS_putih.png" />
      <link
        rel="preload"
        href="/assets/fonts/Lato/Lato-Regular.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/assets/fonts/Lato/Lato-Bold.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
    </Head>
    <body className="text-blueGray-700 bg-calla_lily antialiased">
      <div id="page-transition"></div>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
