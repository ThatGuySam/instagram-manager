import React, { Component } from 'react'
import Clipboard from 'clipboard'

const getRedditPost = require('../helpers/getRedditPost')
const makePostImageUrl = require('../helpers/routes').postImage
const makeCaption = require('../helpers/makeCaption')

export default class extends Component {
  static async getInitialProps ({ query: { id } }) {

    // Get post id
    const redditPost = await getRedditPost(id)
    const postId = id.includes('_') ? id.split('_')[1] : id
    const imageUrl = makePostImageUrl(postId)
    const caption = makeCaption(redditPost)

    return {
      imageUrl,
      postId,
      caption
    }
  }

  componentDidMount () {
    const button = this.copyButton
    const textarea = this.textarea

    this.clipboard = new Clipboard(
      button, {
        target: () => textarea
      }
    )
  }

  componentWillUnmount() {
    this.clipboard.destroy()
  }

  render () {
    const {
      imageUrl,
      // postId,
      caption
    } = this.props

    return (
      <div
        id='post-preview'
        className='container bg-white'
      >
        <div className='row justify-content-center'>
          <div className='col-sm-6'>
            <img 
              src={imageUrl}
              className='img-fluid w-100'
            />

            <div className="form-group w-100 py-5">
              <label htmlFor="exampleFormControlTextarea1">Caption</label>
              <button
                ref={(el) => { this.copyButton = el }}
                type="button"
                className='btn btn-primary m-2'
              >Copy</button>
              <textarea
                ref={(el) => { this.textarea = el }}
                className='form-control bg-transparent'
                id="exampleFormControlTextarea1" 
                rows="15"
                defaultValue={caption}
              ></textarea>
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}
