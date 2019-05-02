const axios = require('axios')

const getImageUrlFromRedditPost = require('./getImageUrlFromRedditPost')

module.exports =  async function (postName) {
    let data = null

    const postId = postName.includes('_') ? postName.split('_')[1] : postName

    // console.log('postId', postId)
    
    await axios.get(`https://www.reddit.com/comments/${postId}/.json`)
        .then(res => data = res.data[0])
        .catch(console.log)

    const redditPost = data.data.children[0]

    return getImageUrlFromRedditPost(redditPost)
}