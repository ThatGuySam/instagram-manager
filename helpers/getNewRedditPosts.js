const getDankChristianMemes = require('./getDankChristianMemes')
const getPosts = require('./ig/getPosts')
const postedMemes = require('./postedMemes')


const matchToIgPosts = function (redditPostTitle, igPosts) {
    return igPosts.some(igPost => {
        const captionEdge = igPost.node.edge_media_to_caption.edges
        // If there's no caption then don't use it
        if (captionEdge.length === 0) return false

        const igPostCaption = captionEdge[0].node.text
        const matches = igPostCaption.includes(redditPostTitle)

        // console.log('Comparing')
        // console.log(redditPostTitle)
        // console.log('to ig post')
        // console.log(igPostCaption)

        if (matches) console.log(`Found matching ig post for "${redditPostTitle}"`)

        return matches
    })
}

const matchToStoredPosts = function (redditPost, memesThatHaveBeenPosted) {
    if (memesThatHaveBeenPosted.length === 0) return false
    
    return (redditPost.data.name in memesThatHaveBeenPosted)
}


const isSupportedPost = function (post) {
    const hasUrl = (typeof post.data.url !== 'undefined')

    if (!hasUrl) return false

    const hasJpeg = (post.data.url.split('.').pop() === 'jpeg')
    const hasJpg = (post.data.url.split('.').pop() === 'jpg')
    const hasPng = (post.data.url.split('.').pop() === 'png')
    const hasImage = (hasJpeg || hasPng || hasJpg)

    return hasImage
}


module.exports = async function () {

    const dankChristianMemes = await getDankChristianMemes()

    // Is not NSFW

    // Has url
    // const postsWithURLs = dankChristianMemes.filter(post => typeof post.data.url !== 'undefined')

    // Is a jpg
    const supportedPosts = dankChristianMemes.filter(isSupportedPost)

    // Has posted
    // Get IG posts
    const igPosts = await getPosts(process.env.USERNAME)
    // Get posted memes from local memory
    const memesThatHaveBeenPosted = postedMemes.getAll()
    console.log('memesThatHaveBeenPosted', Object.keys(memesThatHaveBeenPosted).length)
    // console.log('igPosts', igPosts)
    const newSupportedPosts = supportedPosts.filter(redditPost => {
        const redditPostTitle = redditPost.data.title
        
        console.log(`Searching for "${redditPostTitle}"`)

        // Do any posts from instagram contain this reddit post
        const hasMatchingIgPost = matchToIgPosts(redditPostTitle, igPosts)
        // Check if any of the stored posted match
        const hasMatchingStoredPost = matchToStoredPosts(redditPost, memesThatHaveBeenPosted)

        const hasntPosted = !(hasMatchingIgPost || hasMatchingStoredPost)

        // console.log('has ig', hasMatchingIgPost)
        // console.log('has stored', hasMatchingStoredPost)
        // console.log('hasnt posted', hasntPosted)

        return hasntPosted
    })
    
    return newSupportedPosts
}