import React from 'react'
import Link from 'next/link'


const makePostImageUrl = require('../helpers/routes').postImage


const links = [
  makePostImageUrl('ieavqd'),
  '/post-preview/ieavqd',
  '/post-mockup/ieavqd',
  '/post-image/ieavqd.jpg',
  '/api/generate-post-image?id=ieavqd',
  '/post-details/ieavqd.json',
  '/api/generate-post-details?id=ieavqd'
]

export default () => (
  <ul
    style={{
      background: 'white'
    }}
  >
    {links.map( (link, index) => (
      <li key={index}>
        <a href={link}>
          { link }
        </a>
      </li>
    ))}
  </ul>
)
