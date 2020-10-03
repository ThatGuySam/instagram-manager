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

const updateRecordStatus = (recordId, newStatus) => {
    // const Airtable = require('airtable');

    base('All Posts').update([
        {
          "id": recordId,
          "fields": {
            "Status": newStatus
          }
        }
      ])
}


const priorityMessage = ( message ) => console.log('\n\n******\n\n', message, '\n\n******\n\n')


const getQeuedPosts = () => new Promise((resolve, reject) => {
    // Get posts from Airtable

    let posts = []

    // Formulas
    const isQeued = 'Status = "Qeued"'
    const hasPostDate = 'NOT({Post Date} = "")'

    // Sorts
    const earliestPostDatesFirst = { field: "Post Date", direction: "asc" }


    base('All Posts').select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 3,
        view: 'Grid view',
        fields: ['Reddit Post ID', 'Post Date'],
        filterByFormula: `AND( ${isQeued}, ${hasPostDate} )`,
        sort: [ earliestPostDatesFirst ]
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {

            posts.push({
                airtableId: record.id,
                redditId: record.get('Reddit Post ID'),
                postDate: new Date(record.get('Post Date')),
                postDateString: record.get('Post Date')
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

    priorityMessage('🔥 Starting up... 🔥')

    try {
        // const { query } = url.parse(req.url, true)

        // Get the post id from the query
        // const { id } = query

        const posts = []

        const postIds = await getQeuedPosts()


        // If there were no posts found 
        // then stop
        if (postIds.length === 0) {
            throw new Error('No posts found')
        }


        for (const post of postIds) {

            console.log(`Fetching data for ${post.redditId} from Reddit`)

            const postData = await getPost(post.redditId)

            posts.push({
                ...post,
                ...postData
            })
        }


        Promise.all(postIds.map(({ redditId }) => {
            const postMockupURL = `https://instagram-manager.now.sh/post-image/${redditId}.png`

            console.log(`Requesting image ${postMockupURL}`)

            return axios({
                method: 'get',
                url: postMockupURL,
                responseType: "stream"
            }).then(response => {

                console.log(`Downloading ${postMockupURL} image to filesystem`)

                const downloadStream = response.data.pipe(fs.createWriteStream(`/tmp/${redditId}.png`))

                return new Promise(fulfill => downloadStream.on('finish', fulfill))
            })
        }))

        const scheduler = new InstagramScheduler(process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD, false)

        console.log('scheduler', scheduler)

        console.log('Scheduling posts')

        await scheduler.schedulePosts(posts.map(post => {

            const [ year, month, day ] = post.postDateString.split('-')

            const formattedDate = `${month}/${day}/${year}`

            console.log('formattedDate', formattedDate)
            console.log('postDateString', post.postDateString)


            return {
                account: 'stolendankchristianmemes',
                description: post.caption,
                file: `/tmp/${post.id}.png`,
                release: {
                    date: formattedDate,//"9/12/2020",
                    time: "07:12:AM"
                },
                callback: async function () {
                    updateRecordStatus(post.airtableId, 'Scheduled')
                }
            }
        }))

        priorityMessage('✅ All finished!')

        // Set Cors Headers to allow all origins so data can be requested by a browser
        // res.setHeader("Access-Control-Allow-Origin", "*");
        // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

        // Repond with JSON Data
        res.json(posts)

        // Stop function
        return

    } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')
        res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>')
        console.error('500 Error', e.message)

        priorityMessage('🚫 Whoops, there was a problem.')
    }
}