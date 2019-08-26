const postToInstagram = require('./ig/post')
const postedMemes = require('./postedMemes')
const currentDomain = require('./currentDomain')
const makePostImageUrl = require('./routes').postImage
const makeCaption = require('./makeCaption')

module.exports =  async function (redditPost) {
    const domain = currentDomain.get()
    // const memeImageUrl = `${domain}/static/memes/${redditPost.data.name}.jpg`
    const memeImageUrl = makePostImageUrl(redditPost.data.name)

    // Add it to postedMemes
    postedMemes.store(redditPost)

    // Put it all together
    const caption = makeCaption(redditPost)

    // console.log('caption', caption)
    
    const response = await postToInstagram(memeImageUrl, caption)
    
    return response
}