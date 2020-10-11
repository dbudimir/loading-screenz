import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Halo = () => {
  return (
    <div
      className='video-container'
      dangerouslySetInnerHTML={{
        __html: `<video autoplay="" loop="" playsinline="">
         <source src="https://squad.lol/wp-content/uploads/2020/10/halo-loader.mp4" type="video/mp4">
       </video>`
      }}
    ></div>
    //  <div>
    //    <h1>teste</h1>
    //  </div>
  )
}

export default Halo
