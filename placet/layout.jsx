import React, { Component } from 'react'
import { Slider, Spinner, NonIdealState } from '@blueprintjs/core'

import * as d3 from 'd3'


class Placet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      width: window.width,
      height: window.height,
    }
  }

  componentDidMount () {
    this.svg = d3.select(this.refs.svg)
  }

  render () {
    return (
      <div className='pt-dark np-root'>
        <svg ref='svg' className='np-svg'/>

        <NonIdealState
          title='Loading'
          visual={<Spinner/>}
        />

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
