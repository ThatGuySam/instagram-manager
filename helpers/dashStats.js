const getDankChristianMemes = require('getDankChristianMemes')

module.exports = async function () {

    const dankChristianMemes = await getDankChristianMemes()
    
    return {
        allPosts: dankChristianMemes
    }
}
