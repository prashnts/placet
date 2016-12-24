import React, { Component } from 'react'
import { Button, Position, Toaster } from '@blueprintjs/core'

import autoBind from 'react-autobind'
import cx from 'classnames'
import $ from 'cash-dom'


class ColorSchemeToggle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dark: false,
    }
    autoBind(this)
  }

  toggleScheme () {
    if (this.state.dark) {
      $('body').removeClass('pt-dark')
    } else {
      $('body').addClass('pt-dark')
    }
    this.setState({ dark: !this.state.dark })
  }

  render () {
    const classnames = cx(
      'pt-minimal',
      { 'pt-intent-warning': this.state.dark }
    )

    return (
      <Button
        className={classnames}
        onClick={this.toggleScheme}
        iconName={this.state.dark ? 'flash' : 'moon'}
      />
    )
  }
}


const Toast = Toaster.create({
  className: 'np-toast',
  position: Position.TOP,
})


export { ColorSchemeToggle, Toast }
