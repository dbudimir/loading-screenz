import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"


const Loader = () => {
	return (
		<div className="popup-padded">
			 <h2>test 2</h2>
		</div>
  )
}

// --------------

let elm = document.createElement("DIV")
elm.classList.add('fixed-elm')

ReactDOM.render(
	 <Loader />,
	 document.body.appendChild(elm)
   
)

export default Loader