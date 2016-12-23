import React from 'react'
import ReactDOM from 'react-dom'

import Placet from './layout'
import { ColorSchemeToggle } from './utils'


function _renderComponent(id, component) {
  ReactDOM.render(component, document.getElementById(id))
}

function init () {
  _renderComponent('placetRoot', <Placet/>)
  _renderComponent('colorSchemeToggle', <ColorSchemeToggle/>)
}

export { init }
