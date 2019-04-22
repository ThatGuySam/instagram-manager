import React, { Component } from 'react'

const getDankChristianMemes = require('../helpers/getDankChristianMemes')
// const postedMemes = require('../helpers/postedMemes')

export default class extends Component {
  static async getInitialProps ({ query: { id } }) {

    let redditPost
    
    const dankChristianMemes = await getDankChristianMemes()

    if (dankChristianMemes.length !== 0) {
      redditPost = dankChristianMemes.find(meme => meme.data.name == id )

      // console.log('dankChristianMemes', dankChristianMemes.map(meme => meme.data.name))
      // console.log('redditpost', redditPost)
    }

    // const dankChristianMemes = await getDankChristianMemes()

    return { redditPost }
  }



  render () {
    const { redditPost } = this.props
    return (
      <div
        className='container'
        style={{ maxWidth: 1080 }}
      >
        <div
          className='d-flex flex-column mt-5 mx-5'
          style={{ height: 1080 }}
        >
          <div className='d-flex flex-column flex-fill justify-content-center'>
            <img src={redditPost.data.url} className='w-100 h-100' style={{ objectFit: 'contain' }} />
          </div>
          <img src='/static/reddit-banner.png' className='img-fluid align-self-end w-100' />
        </div>
      </div>
    )
  }
}
