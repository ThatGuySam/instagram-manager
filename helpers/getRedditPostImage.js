const axios = require('axios')

const getRedditPost = require('./getRedditPost')

module.exports =  async function (postName) {
    const redditPost = await getRedditPost(postName)

    return getImageUrlFromRedditPost(redditPost)
}