const getDankChristianMemes = require('./getDankChristianMemes')
const getPosts = require('./ig/getPosts')


module.exports =  async function () {

    const dankChristianMemes = await getDankChristianMemes()

    // Is not NSFW

    // Has url
    const postsWithURLs = dankChristianMemes.filter(post => typeof post.data.url !== 'undefined')

    // Is a jpg
    const jpegPosts = postsWithURLs.filter(post => post.data.url.split('.').pop() === 'jpg')

    // Has posted
    const igPosts = await getPosts(process.env.USERNAME)
    console.log('igPosts', igPosts)
    const newJpegPosts = jpegPosts.filter(redditPost => {
        const redditPostTitle = redditPost.data.title

        // Do any posts from instagram contain this reddit post
        return igPosts.some(igPost => {
            const captionEdge = igPost.node.edge_media_to_caption.edges
            if (captionEdge.length === 0) return false

            return !captionEdge[0].node.text.includes(redditPostTitle)
        })
    })
    
    return newJpegPosts
}