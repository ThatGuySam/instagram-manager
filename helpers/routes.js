module.exports =  {
    'postImage': (postId) => `${process.env.SCREENSHOT_ENDPOINT}${redditPost.data.name}.jpg?quality=100`
}