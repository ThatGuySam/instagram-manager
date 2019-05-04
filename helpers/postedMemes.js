const is = require('is_js')
let postedMemes = {}

module.exports.getAll = function () {
    return postedMemes
}

module.exports.getNames = function () {
    return Object.entries(postedMemes).map(memeObject => {
        return memeObject[1].data.title
    })
}

module.exports.clear = function () {
    postedMemes = {}
    return postedMemes
}

module.exports.store = function (redditPost) {
    if (is.empty(redditPost)) {
        console.log('Can\'t store. Post is empty. ')
        return
    }

    console.log(`Storing Meme "${redditPost.data.title}"`)
    return postedMemes[redditPost.data.name] = redditPost
}