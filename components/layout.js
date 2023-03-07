import Head from 'next/head'
import Navbar from './navbar'
import Footer from './footer'

const cardImageURL = new URL("/images/pilot.png", process.env.PUBLIC_URL).toString()

export default function Layout({ children }) {
  return (
    <div className="bg-white">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />

        <meta
          name="description"
          content="Fast and Secure CI on your infrastructure."
          key="description"
        />
        <meta name="author" content="OpenFaaS Ltd" />

        <meta property="twitter:title" content="Actuated - Fast and Secure CI on your infrastructure." key="tw_title"/>
        <meta property="twitter:description" content="Keep your team productive &amp; focused with Fast and Secure CI on your infrastructure." key="tw_description"/>
        
        <meta property="og:title" content="Actuated - Fast and Secure CI on your infrastructure." key="og_title"/>
        <meta property="og:description" content="Keep your team productive &amp; focused with Fast and Secure CI on your infrastructure." key="og_description"/>
        <meta property="og:image" content={cardImageURL} key="og_image"/>
        <meta name="twitter:image:src" content={cardImageURL} key="tw_image" />

        <meta name="twitter:card" content="summary_large_image" key="tw_card"/>

        <title>Actuated - Fast and Secure CI on your infrastructure.</title>
      </Head>

      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}