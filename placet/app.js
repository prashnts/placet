import React from 'react'
import ReactDOM from 'react-dom'

import Placet from './layout'


function init () {
  const container = document.getElementById('placetRoot')
  ReactDOM.render(<Placet />, container)
}

export { init }
