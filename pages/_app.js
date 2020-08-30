import React from 'react'
import Head from 'next/head'

function InstagramManager({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, height=device-height, initial-scale=1, shrink-to-fit=no' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default InstagramManager