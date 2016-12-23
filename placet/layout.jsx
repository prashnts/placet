import React, { Component } from 'react'
import { Spinner, NonIdealState } from '@blueprintjs/core'

import Network from './components/network'
import DevelopmentalStageSlider from './components/developmental-stage-slider'


class Placet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  render () {
    return (
      <div className='np-root'>

        <Network onLoad={val => this.setState({loaded: val})}/>

        {!this.state.loaded &&
          <NonIdealState
            title='Loading'
            visual={<Spinner/>}
          />
        }

        <section className='np-tools np-container'>
          <DevelopmentalStageSlider/>
        </section>
      </div>
    )
  }
}


export default Placet
