const express = require('express')
const next = require('next')

const postMeme = require('./helpers/postMeme')
const getNewRedditPosts = require('./helpers/getNewRedditPosts')
const postedMemes = require('./helpers/postedMemes')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/post', async (req, res) => {

    const redditPosts = await getNewRedditPosts()

    if (redditPosts.length === 0) console.log('No Reddit posts found')

    const redditPost = redditPosts[0]

    res.header('Content-Type','application/json')
    res.send(JSON.stringify(postedMemes.getAll(), null, 4))

    // console.log('redditPosts', redditPosts)

    const response = await postMeme(redditPost)

    // console.log('response', response)

    console.log('-- Finished Posting')
  })

  // server.get('/posts/:id', (req, res) => {
  //   return app.render(req, res, '/posts', { id: req.params.id })
  // })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
