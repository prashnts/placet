import React, { Component } from 'react'
import { Slider } from '@blueprintjs/core'

import autoBind from 'react-autobind'

import { STAGES } from '../constants'


class DevelopmentalStageSlider extends Component {
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
      <Slider value={this.state.value}
              onChange={this.changeStage}
              renderLabel={value => STAGES[value]}
              min={0}
              max={STAGES.length - 1}
              disabled={this.state.disabled}
              stepSize={1}
              showTrackFill={false}/>
    )
  }
}

export default DevelopmentalStageSlider
