import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Components
import Halo from './loaders/halo'

import '../styles/popup.css'

const Loader = () => {
  return (
    <>
      <Halo />
    </>
  )
}

// --------------

let elm = document.createElement('DIV')
elm.classList.add('loading-screenz-fixed-elm')

ReactDOM.render(<Loader />, document.body.appendChild(elm))

export default Loader
