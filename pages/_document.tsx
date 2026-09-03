import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/img/Logo_PENS_putih.png" />
      <link rel="apple-touch-icon" href="/img/Logo_PENS_putih.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
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
