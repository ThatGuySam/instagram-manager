const postedMemes = {}

module.exports.getAll = function () {
    return postedMemes
}

module.exports.store = function (redditPost) {
    console.log(`Storing Meme "${redditPost.data.title}"`)
    return postedMemes[redditPost.data.name] = redditPost
}