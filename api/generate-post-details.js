// URL utility
import url from 'url'

const { postImage: makePostImageUrl } = require('../helpers/routes')

const getRedditPost = require('../helpers/getRedditPost')
const makeCaption = require('../helpers/makeCaption')


export default async function (req, res) {

    try {
        const { query } = url.parse(req.url, true)

        // Get the post id from the query
        const { id } = query

        // This has to be a publicly accessible domain for mql
        const screenshotHost = process.env.SCREENSHOT_ENDPOINT || `https://${process.env.VERCEL_URL}`

        const postId = id.includes('_') ? id.split('_')[1] : id

        const redditPost = await getRedditPost(id)

        // Set Cors Headers to allow all origins so data can be requested by a browser
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

        console.log('Generated post data', postId)

        // Repond with Video JSON Data
        res.json({
            imageUrl: screenshotHost + makePostImageUrl(postId),
            caption: makeCaption(redditPost),
            redditPost
        })

        // Stop function
        return

    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error('500 Error', e.message);
    }
}