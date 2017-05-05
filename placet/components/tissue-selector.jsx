import React, { Component } from 'react'

import autoBind from 'react-autobind'

const TISSUES = [
  { id: 'A1C', label: 'Primary auditory cortex' },
  { id: 'AMY', label: 'Amygdala' },
  { id: 'CBC', label: 'Cerebellar cortex' },
  { id: 'DFC', label: 'Dorsolateral prefrontal cortex' },
  { id: 'HIP', label: 'Hippocampus' },
  { id: 'IPC', label: 'Posterior inferior parietal cortex' },
  { id: 'ITC', label: 'Inferior temporal cortex' },
  { id: 'M1C', label: 'Primary motor cortex' },
  { id: 'MD:', label: 'Mediodorsal nucleus of thalamus' },
  { id: 'MFC', label: 'Medial prefrontal cortex' },
  { id: 'OFC', label: 'Orbital prefrontal cortex' },
  { id: 'S1C', label: 'Primary somatosensory cortex' },
  { id: 'STC', label: 'Superior temporal cortex' },
  { id: 'STR', label: 'Striatum' },
  { id: 'V1C', label: 'Primary visual cortex' },
  { id: 'VFC', label: 'Ventrolateral prefrontal cortex' },
]


class TissueSelector extends Component {
  constructor (props) {
    super(props)
    this.state = { ...props }
    this.emitChange = props.onChange
    autoBind(this)
  }

  changeStage (event) {
    const val = event.target.value
    this.setState({ value: val })
    this.emitChange(val)
  }

  componentWillReceiveProps (props) {
    this.setState({ ...props })
  }

  render () {
    return (
      <div className='pt-select'>
        <select onChange={this.changeStage}
                value={this.state.value}>
          {TISSUES.map(t =>
            <option value={t.id} key={t.id}>{t.label}</option>
          )}
        </select>
      </div>
    )
  }
}


export default TissueSelector
export { TISSUES }
