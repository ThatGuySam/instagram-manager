const postToInstagram = require('./ig/post')
const postedMemes = require('./postedMemes')
const makeHashtags = require('./makeHashtags')
// const makeCaption = require('./makeCaption')

module.exports =  async function (post) {

    // Add it to postedMemes
    postedMemes.store(post)
    
    const postTitle = post.data.title
    const postAuthor = post.data.author
    const hashtags = makeHashtags()

    // Put it all together
    const caption = `${postTitle} . Stolen from u/${postAuthor} . ${hashtags}`

    // console.log('caption', caption)
    
    const response = await postToInstagram(post.data.url, caption)
    
    return response
}