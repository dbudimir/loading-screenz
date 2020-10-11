import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Halo = () => {
  return (
    <div
      className='video-container'
      dangerouslySetInnerHTML={{
        __html: `<video autoplay="" loop="" playsinline="">
          <source src="https://firebasestorage.googleapis.com/v0/b/loading-screenz.appspot.com/o/halo-loader.mp4?alt=media&token=38b8a04b-9bbf-4645-bf9a-7f38888e432b" type="video/mp4">
        </video>`
      }}
    ></div>
  )
}

export default Halo
