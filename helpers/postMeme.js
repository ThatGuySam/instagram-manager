const postToInstagram = require('./ig/post')
const postedMemes = require('./postedMemes')
const makeHashtags = require('./makeHashtags')
const currentDomain = require('./currentDomain')

module.exports =  async function (redditPost) {
    const domain = currentDomain.get()
    // const memeImageUrl = `${domain}/static/memes/${redditPost.data.name}.jpg`
    const memeImageUrl = `${process.env.SCREENSHOT_ENDPOINT}${redditPost.data.name}.jpg?quality=100`

    // Add it to postedMemes
    postedMemes.store(redditPost)
    
    const postTitle = redditPost.data.title
    const postAuthor = redditPost.data.author
    const hashtags = makeHashtags()

    // Put it all together
    const caption = `${postTitle} . Stolen from u/${postAuthor} . ${hashtags}`

    // console.log('caption', caption)
    
    const response = await postToInstagram(memeImageUrl, caption)
    
    return response
}