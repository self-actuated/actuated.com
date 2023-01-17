import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/png" href="/images/actuated.png" />

        {/* Tailwind UI font */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>

        {/* Highlightjs theme */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"
        ></link>

        {/* manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
        <link rel="manifest" href="/manifest.json" />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M5YNDNX7VT"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-M5YNDNX7VT');
          `,
        }} />

        <link rel="apple-touch-icon" href="/images/actuated.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
