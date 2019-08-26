module.exports =  {
    'postImage': (postId) => `${process.env.SCREENSHOT_ENDPOINT}${postId}.jpg?quality=100`
}