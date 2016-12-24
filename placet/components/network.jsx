import React, { Component } from 'react'
import { Intent } from '@blueprintjs/core'

import autoBind from 'react-autobind'
import * as d3 from 'd3'

import { request } from '../mixins'
import { STAGES } from './developmental-stage-slider'
import { Toast } from '../utils'


class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: props.stage,
      tissue: props.tissue,
    }
    this.emitLoad = props.onLoad
    autoBind(this)
  }

  componentDidMount () {
    this.svg = d3.select(this.refs.svg)
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-2))
      .force('center', d3.forceCenter(600, 400))

    request({ url: '/data/network_adj_list.json' })
      .then(resp => {
        this.drawGraph(resp)
        this.emitLoad(true)
      })
  }

  componentWillReceiveProps (props) {
    const { stage, tissue } = props
    const stage_id = STAGES[stage].toLowerCase()
    if (stage !== this.state.stage || tissue !== this.state.tissue) {
      this.setState({ stage: stage, tissue: tissue })
      this.emitLoad(false)
      request({ url: `/data/expression/${stage_id}/${tissue}.json`})
        .then(resp => {
          this.emitLoad(true)
        })
        .fail(() => {
          Toast.show({
            message: 'Could not load the expression weights.',
            intent: Intent.DANGER,
            iconName: 'cross',
          })
          this.emitLoad(true)
        })
    }
  }

  drawGraph (graph) {
    const color = d3.scaleOrdinal(d3.schemeCategory20)
    let link = this.svg.append('g')
        .attr('class', 'np-graph-links')
      .selectAll('lines')
      .data(graph.links)
      .enter()
        .append('line')
          .attr('stroke-width', d => 0)

    let node = this.svg.append('g')
        .attr('class', 'np-graph-nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
        .append('circle')
          .attr('r', d => Math.log(1 + d.deg) * 2)
          .attr('fill', d => color(d.group))
          .call(d3.drag()
              .on('start', this.dragStart)
              .on('drag', this.dragMove)
              .on('end', this.dragEnd))

    const _tick = () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }

    this.simulation.nodes(graph.nodes)
      .on('tick', _tick)
    this.simulation.force('link')
      .links(graph.links)
  }

  dragStart (d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.3).restart()
    }
    d.fx = d.x
    d.fy = d.y
  }

  dragMove (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragEnd (d) {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }

  render () {
    return <svg ref='svg' className='np-svg'></svg>
  }
}

export default Network
