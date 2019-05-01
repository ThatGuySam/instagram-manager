import React, { Component } from 'react'

const getDankChristianMemes = require('../helpers/getDankChristianMemes')
const getImageUrlFromRedditPost = require('../helpers/getImageUrlFromRedditPost')
// const postedMemes = require('../helpers/postedMemes')

export default class extends Component {
  static async getInitialProps ({ query: { id } }) {

    let imageUrl
    
    const dankChristianMemes = await getDankChristianMemes()

    if (dankChristianMemes.length !== 0) {
      const redditPost = dankChristianMemes.find(meme => meme.data.name == id )

      imageUrl = getImageUrlFromRedditPost(redditPost)
      

      // console.log('dankChristianMemes', dankChristianMemes.map(meme => meme.data.name))
      // console.log('redditpost', redditPost)
    }

    // const dankChristianMemes = await getDankChristianMemes()

    return { imageUrl }
  }



  render () {
    const { imageUrl } = this.props
    return (
      <div
        id='mockup'
        className='container px-0'
        style={{ maxWidth: 1080 }}
      >
        <div
          className='d-flex flex-column align-items-stretch'
          style={{ minHeight: 1080, maxHeight: 1350 }}
        >
          <div
            className='d-flex flex-fill flex-grow-1'
          >
            <img 
              src={imageUrl}
              className='img-fluid w-100 pt-5 px-5'
              style={{
                maxHeight: 1235,
                objectFit: 'contain'
              }}
            />
          </div>
          <img src='/static/reddit-banner.png' className='img-fluid align-self-end w-100 px-4' />
        </div>
      </div>
    )
  }
}
