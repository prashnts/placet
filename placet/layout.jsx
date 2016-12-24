import React, { Component } from 'react'
import { Spinner, NonIdealState } from '@blueprintjs/core'

import Network from './components/network'
import DevelopmentalStageSlider from './components/developmental-stage-slider'


class Placet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      stage: 2,
      tissue: 'A1C',
    }
  }

  render () {
    return (
      <div className='np-root'>

        <Network
          onLoad={val => this.setState({loaded: val})}
          stage={this.state.stage}
          tissue={this.state.tissue}
        />

        {!this.state.loaded &&
          <NonIdealState
            title='Loading'
            visual={<Spinner/>}
          />
        }

        <section className='np-tools np-container'>
          <DevelopmentalStageSlider
            onChange={v => this.setState({ stage: v })}
            value={this.state.stage}
            disabled={!this.state.loaded}
          />
        </section>
      </div>
    )
  }
}


export default Placet
