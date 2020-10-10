import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"

const Hello = () => {
	return (
		<div className="popup-padded">
			 <h2>test 2</h2>
		</div>
  )
}

// --------------

ReactDOM.render(
    <Hello />,
    document.getElementById('root')
)