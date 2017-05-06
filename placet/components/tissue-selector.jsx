import React, { Component } from 'react'

import autoBind from 'react-autobind'

import { TISSUES } from '../constants'


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
