const Url = require('url-parse')


const checkForImgurUrl = function (urlString) {
    const url = new Url(urlString)
    const isImgurUrl = url.hostname === 'imgur.com'

    if (!isImgurUrl) return null

    return `https://i.imgur.com${url.pathname}.jpg`
}


module.exports = function (post) {
    const hasUrl = (typeof post.data.url !== 'undefined')

    if (!hasUrl) return null

    const hasJpeg = (post.data.url.split('.').pop() === 'jpeg')
    const hasJpg = (post.data.url.split('.').pop() === 'jpg')
    const hasPng = (post.data.url.split('.').pop() === 'png')
    const urlIsImage = (hasJpeg || hasPng || hasJpg)

    if (urlIsImage) return post.data.url

    const imgurUrl = checkForImgurUrl(post.data.url)

    if (imgurUrl !== null) {
        return imgurUrl
    }

    return null
}