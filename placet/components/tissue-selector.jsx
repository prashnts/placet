import React, { Component } from 'react'
import { Slider } from '@blueprintjs/core'

import autoBind from 'react-autobind'

const TISSUES = [
  'A1C',
  'CBC',
  'HIP',
  'ITC',
  'MD',
  'OFC',
  'STC',
  'V1C',
  'AMY',
  'DFC',
  'IPC',
  'M1C',
  'MFC',
  'S1C',
  'STR',
  'VFC',
]


class TissueSelector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
    }
    this.emitChange = props.onChange
    autoBind(this)
  }

  changeStage (value) {
    this.setState({ value: value })
    this.emitChange(value)
  }

  componentWillReceiveProps (props) {
    this.setState({ ...props })
  }

  render () {
    return (
      <div/>
    )
  }
}


export default TissueSelector
export { TISSUES }
