const postToInstagram = require('./ig/post')
const postedMemes = require('./postedMemes')
// const makeCaption = require('./makeCaption')

module.exports =  async function (post) {

    // Add it to postedMemes
    postedMemes.store(post)
    
    const postTitle = post.data.title
    const postAuthor = post.data.author
    const caption = `${postTitle} . Stolen from u/${postAuthor}`
    
    const response = await postToInstagram(post.data.url, caption)
    
    return response
}