const makeHashtags = require('./makeHashtags')
const convertLineBreaks = require('./convertLineBreaks')

module.exports = function (redditPost) {
    const postTitle = redditPost.data.title
    const postAuthor = redditPost.data.author
    const hashtags = makeHashtags()

    // Put it all together
    const caption = `${postTitle}. \r\rStolen from u/${postAuthor}. \r\r\r${hashtags}`

    return convertLineBreaks(caption)
}