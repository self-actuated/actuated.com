import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <div className="bg-white">
      <Head>
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

        <meta name="twitter:card" content="summary_large_image" />

        <title>Actuated - Blazing fast CI</title>
      </Head>

      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}