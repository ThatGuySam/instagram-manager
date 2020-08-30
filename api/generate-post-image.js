// URL utility
import url from 'url'
import axios from 'axios'
import mql from '@microlink/mql'

const { postImage: makePostImageUrl } = require('../helpers/routes')


export default async function (req, res) {

    try {
        const { query } = url.parse(req.url, true)

        // Get the post id from the query
        const { id: postId } = query

        // This has to be a publicly accessible domain for mql
        const screenshotHost = process.env.SCREENSHOT_ENDPOINT || `https://${process.env.VERCEL_URL}`
        const mockupUrl = screenshotHost + makePostImageUrl(postId)

        // console.log('screenshotHost', screenshotHost)

        const { data } = await mql(mockupUrl, {
            screenshot: true,
            viewport: {
                width: 1500,
                height: 1500,
            },
            element: '#mockup',
            // waitFor: '#mockup img',
        })

        const {
            screenshot
        } = data

        // Fetch the Microlink screenshot with a pipeable response
        const screenshotResponse = await axios.get(screenshot.url, {
            responseType: 'stream'
        })
        
        // Set a header for jpg
        res.setHeader('Content-Type', 'image/png')

        // Set Cors Headers to allow all origins so data can be requested by a browser
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

        console.log('Streamed image', postId)
        console.log('MQL Source', screenshot.url)

        // Pipe the screenshot on through to our client
        screenshotResponse.data.pipe(res)

        // Stop function
        return

    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error('500 Error', e.message);
    }
}