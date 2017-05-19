import React, { Component } from 'react'

import { Button } from '@blueprintjs/core'
import { saveAs } from 'file-saver'


class SVGExporter extends Component {
  constructor (props) {
    super(props)
    this.getSVG = props.getSVG
    this.exportCanvas = this.exportCanvas.bind(this)
  }

  exportCanvas () {
    const blob = new Blob([ this.getSVG() ], { type: 'image/svg+xml' })
    saveAs(blob, 'placet.svg')
  }

  render () {
    return (
      <Button iconName='export'
              className='pt-minimal'
              onClick={this.exportCanvas}/>
    )
  }
}


export default SVGExporter
