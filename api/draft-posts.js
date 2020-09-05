// URL utility
// import url from 'url'
import fs from 'fs'
import axios from 'axios'
import Airtable from 'airtable'

import InstagramScheduler from '../helpers/creator-studio/scheduler'
import { getPost } from './generate-post-details'

// const { postImage: makePostImageUrl } = require('../helpers/routes')

// const getRedditPost = require('../helpers/getRedditPost')
// const makeCaption = require('../helpers/makeCaption')


Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});

const base = Airtable.base(process.env.AIRTABLE_BASE)

const draftRecord = (recordId) => {
    // const Airtable = require('airtable');

    base('All Posts').update([
        {
          "id": recordId,
          "fields": {
            "Status": "Drafted"
          }
        }
      ])
}


const getQeuedPosts = () => new Promise((resolve, reject) => {
    // Get posts from Airtable

    let posts = []


    base('All Posts').select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 3,
        view: 'Grid view',
        fields: ['Reddit Post ID'],
        filterByFormula: 'Status = "Qeued"'
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {

            posts.push({
                airtableId: record.id,
                redditId: record.get('Reddit Post ID')
            })

            // console.log('Retrieved', record.get('Reddit Post ID'));
        })
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage()
    
    }, function done(err) {


        if (err) {
            console.error(err)
            reject()
        } else {
            resolve(posts)
        }
    })

})


export default async function (req, res) {

    try {
        // const { query } = url.parse(req.url, true)

        // Get the post id from the query
        // const { id } = query

        const posts = []

        const postIds = await getQeuedPosts()


        for (const post of postIds) {

            console.log(`Fetching data for ${post.redditId} from Reddit`)

            const postData = await getPost(post.redditId)

            console.log('post.airtableId', post.airtableId)

            posts.push({
                airtableId: post.airtableId,
                ...postData
            })
        }


        Promise.all(postIds.map(({ redditId }) => {
            console.log(`Requesting image for ${redditId}`)
            return axios({
                method: 'get',
                url: `https://instagram-manager.now.sh/post-image/${redditId}.png`,
                responseType: "stream"
            }).then(response => {

                console.log(`Downloading ${redditId} image to filesystem`)

                const downloadStream = response.data.pipe(fs.createWriteStream(`/tmp/${redditId}.png`))

                return new Promise(fulfill => downloadStream.on('finish', fulfill))
            })
        }))

        const scheduler = new InstagramScheduler(process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD, false)

        console.log('scheduler', scheduler)

        console.log('Drafting posts')

        await scheduler.schedulePosts([posts[0], posts[1]].map(post => {
            return {
                account: 'stolendankchristianmemes',
                description: post.caption,
                file: `/tmp/${post.id}.png`,
                release: {
                    date: "31.08.2020",
                    time: "07:12"
                },
                callback: async function () {
                    draftRecord(post.airtableId)
                }
            }
        }))

        // Set Cors Headers to allow all origins so data can be requested by a browser
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

        // Repond with JSON Data
        res.json(posts)

        // Stop function
        return

    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
        console.error('500 Error', e.message);
    }
}