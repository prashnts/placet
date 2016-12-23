import React, { Component } from 'react'
import { Slider, Spinner, NonIdealState } from '@blueprintjs/core'

import Network from './components/network'


class Placet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  render () {
    return (
      <div className='pt-dark np-root'>

        <Network onLoad={val => this.setState({loaded: val})}/>

        {!this.state.loaded &&
          <NonIdealState
            title='Loading'
            visual={<Spinner/>}
          />
        }

        <section className='np-tools'>
          <Slider
              min={0}
              max={48}
              stepSize={6}
              labelStepSize={10}
              onChange={(value) => this.setState({ value3: value })}
              showTrackFill={false}
              value={this.state.value3}
          />
        </section>
      </div>
    )
  }
}


export default Placet
