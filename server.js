const express = require('express')
const next = require('next')

const postToInstagram = require('./helpers/ig/post')
const getNewRedditPosts = require('./helpers/getNewRedditPosts')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/post', async (req, res) => {

    const redditPosts = await getNewRedditPosts()

    const post = redditPosts[0]

    // console.log('post', post)

    const response = await postToInstagram(post.data.url, post.data.title)

    // console.log('response', response)
    
    res.send(response)
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
