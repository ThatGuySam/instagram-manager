// URL utility
// import url from 'url'
import fs from 'fs'
import axios from 'axios'
import InstagramScheduler from '../helpers/creator-studio/scheduler'

// const { postImage: makePostImageUrl } = require('../helpers/routes')

// const getRedditPost = require('../helpers/getRedditPost')
// const makeCaption = require('../helpers/makeCaption')


export default async function (req, res) {

    try {
        // const { query } = url.parse(req.url, true)

        // Get the post id from the query
        // const { id } = query


        let scheduler = new InstagramScheduler(process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD, false)

        console.log('scheduler', scheduler)

        console.log('Fetching instagram image to Upload')

        const response = await axios({
            method: 'get',
            url: 'https://instagram-manager.now.sh/post-image/i81p68.png',
            responseType: "stream"
        })

        console.log('Downloading image to filesystem')

        const downloadStream = response.data.pipe(fs.createWriteStream('/tmp/i81p68.png'))

        // Wait for download tot finish
        await new Promise(fulfill => downloadStream.on('finish', fulfill))

        // console.log('downloadStream', downloadStream)


        console.log('Scheduling posts')

        await scheduler.schedulePosts([
            {
                account: 'stolendankchristianmemes',
                description: "The post's description",
                file: '/tmp/i81p68.png',
                release: {
                    date: "31.08.2020",
                    time: "07:12"
                }
            }
        ])

        // Set Cors Headers to allow all origins so data can be requested by a browser
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

        // Repond with JSON Data
        res.json('Works')

        // Stop function
        return

    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error('500 Error', e.message);
    }
}