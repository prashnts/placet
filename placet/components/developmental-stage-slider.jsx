import React, { Component } from 'react'
import { Slider } from '@blueprintjs/core'

import autoBind from 'react-autobind'

const STAGES = [
  'Early fetal 2',
  'Early midfetal 1',
  'Early midfetal 2',
  'Late midfetal',
  'Late fetal',
  'Neonatal early infancy',
  'Late infancy',
  'Early childhood',
  'Middle-late childhood',
  'Adolescence',
  'Young adulthood',
  'Middle adulthood',
  'Late adulthood',
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
          renderLabel={value => {
            if (this.state.chosen_stage === value) {
              return STAGES[value]
            } else {
              return value + 1
            }
          }}
      />
    )
  }
}

export default DevelopmentalStageSlider
