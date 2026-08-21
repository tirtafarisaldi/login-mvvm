import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" sizes="76x76" href="/img/brand/apple-icon.png" />
    </Head>
    <body className="text-blueGray-700 bg-calla_lily antialiased">
      <div id="page-transition"></div>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
