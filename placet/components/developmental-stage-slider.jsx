import React, { Component } from 'react'
import { Slider } from '@blueprintjs/core'

import autoBind from 'react-autobind'

const STAGES = [
  'Prenatal',
  'Infant',
  'Child',
  'Adolescent',
  'Adult',
]


class DevelopmentalStageSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chosen_stage: 0,
    }
    autoBind(this)
  }

  render () {
    return (
      <Slider
          min={0}
          max={STAGES.length - 1}
          stepSize={1}
          onChange={(value) => this.setState({ chosen_stage: value })}
          showTrackFill={false}
          value={this.state.chosen_stage}
          renderLabel={value => STAGES[value]}
      />
    )
  }
}

export default DevelopmentalStageSlider
