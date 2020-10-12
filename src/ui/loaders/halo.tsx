import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Halo = () => {
  return (
    <>
      <div
        className='video-container'
        dangerouslySetInnerHTML={{
          __html: `<video autoplay="" loop="" playsinline="">
           <source src="https://firebasestorage.googleapis.com/v0/b/loading-screenz.appspot.com/o/halo-loader-trimmed.mp4?alt=media&token=df508f7b-eeca-45f8-ab07-9becfbfab4ce" type="video/mp4">
			</video>
			<div className='cover'></div>`
        }}
      ></div>
    </>
  )
}

export default Halo
