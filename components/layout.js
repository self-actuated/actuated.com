import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-white">
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="/images/actuated.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Keep your team productive &amp; focused with blazing fast CI"
          key="description"
        />

        <meta property="twitter:title" content="Actuated - Blazing fast CI" key="tw_title"/>
        <meta property="twitter:description" content="Keep your team productive &amp; focused with blazing fast CI" key="tw_description"></meta>
        
        <meta property="og:title" content="Actuated - Blazing fast CI" key="og_title"/>
        <meta property="og:description" content="Keep your team productive &amp; focused with blazing fast CI" key="og_description"></meta>

        {/* Tailwind UI font */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>

        {/* Highlightjs theme */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"></link>

        <link rel="apple-touch-icon" href="/images/actuated.png" />

        {/* manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
        <link rel="manifest" href="/manifest.json" />

        <title>Actuated - Blazing fast CI</title>
      </Head>

      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}