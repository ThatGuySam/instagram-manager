const axios = require('axios')

const getRedditPost = require('./getRedditPost')
const getImageUrlFromRedditPost = require('./getImageUrlFromRedditPost')

module.exports =  async function (postName) {
    const redditPost = await getRedditPost(postName)

    return getImageUrlFromRedditPost(redditPost)
}