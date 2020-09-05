/*
In production the stylesheet is compiled to .next/static/style.css and served from /_next/static/style.css

You have to include it into the page using either next/head or a custom _document.js, as is being done in this file.
*/
import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import {description} from '../package.json'

export default class MyDocument extends Document {
  render () {
    return (
      <html lang='en'>
        <Head>
          <meta charSet='utf-8' />
          
          <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T' crossOrigin='anonymous' />
        </Head>
        <body style={{ backgroundColor: '#FF5700' }}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
