import React, { Component } from 'react'
import { Spinner, NonIdealState } from '@blueprintjs/core'

import Network from './components/network'
import TissueSelector from './components/tissue-selector'
import DevelopmentalStageSlider from './components/developmental-stage-slider'
import SVGExporter from './components/export-svg'


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
        <Network onLoad={loaded => this.setState({ loaded })}
                 ref='network'
                 stage={this.state.stage}
                 tissue={this.state.tissue}/>

        {!this.state.loaded &&
          <NonIdealState title='Loading'
                         visual={<Spinner/>}/>}

        <section className='np-tools np-container'>
          <div className='fl w-30 pr2'>
            <TissueSelector value={this.state.tissue}
                            onChange={v => this.setState({ tissue: v })}
                            disabled={!this.state.loaded}/>
            <SVGExporter getSVG={() => this.refs.network.exportSVG()} />
          </div>
          <div className='fl w-70 pa2'>
            <DevelopmentalStageSlider value={this.state.stage}
                                      onChange={v => this.setState({ stage: v })}
                                      disabled={!this.state.loaded}/>
          </div>
        </section>
      </div>
    )
  }
}


export default Placet
