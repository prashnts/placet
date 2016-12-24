import React, { Component } from 'react'
import { Intent } from '@blueprintjs/core'

import autoBind from 'react-autobind'
import memoize from 'lodash/memoize'
import * as d3 from 'd3'

import { request } from '../mixins'
import { STAGES } from './developmental-stage-slider'
import { Toast } from '../utils'

const color = d3.scaleOrdinal(d3.schemeCategory20)
const scheme = d3.interpolateCool
const GREY = d3.color('#ccc')


const radiiScale = d3.scaleLinear()
  .domain([0, 1])
  .range([3, 40])


class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: props.stage,
      tissue: props.tissue,
    }
    this.expression = {}

    this.emitLoad = props.onLoad
    autoBind(this)

    this.computeRadii = memoize(this._computeRadii)
    this.computeColor = memoize(this._computeColor)
    this.computeStrokeColor = memoize(this._computeStrokeColor)
  }

  _clearCache () {
    this.computeRadii.cache.clear()
    this.computeColor.cache.clear()
    this.computeStrokeColor.cache.clear()
  }

  _computeRadii (node) {
    let exp = this.expression[node.id]
    if (exp) {
      return radiiScale(this.expression[node.id])
    } else {
      return 1
    }
  }

  _computeColor (node) {
    let exp = this.expression[node.id]
    if (exp) {
      return scheme(exp)
    } else {
      return GREY
    }
  }

  _computeStrokeColor (node) {
    return d3.color(this._computeColor(node)).darker(1)
  }

  componentDidMount () {
    this.svg = d3.select(this.refs.svg)
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-1))
      .force('center', d3.forceCenter(600, 400))

    request({ url: '/data/network_adj_list.json' })
      .then(resp => {
        this.graph = resp
        this.drawGraph()
        this.updateGraph()
          .then(() => this.emitLoad(true))
      })
  }

  componentWillReceiveProps (props) {
    const { stage, tissue } = props
    if (stage !== this.state.stage || tissue !== this.state.tissue) {
      this.setState({ stage: stage, tissue: tissue }, () => {
        this.emitLoad(false)
        this.updateGraph()
          .then(() => this.emitLoad(true))
      })
    }
  }

  drawGraph () {
    this._links = this.svg.append('g')
        .attr('class', 'np-graph-links')
      .selectAll('lines')
      .data(this.graph.links)
      .enter()
        .append('line')
          .attr('stroke-width', 1)

    this._nodes = this.svg.append('g')
        .attr('class', 'np-graph-nodes')
      .selectAll('circle')
      .data(this.graph.nodes)
      .enter()
        .append('g')
        .on('mouseover', function (d) {
          d3.select(this).selectAll('.np-label').style('display', '')
        })
        .on('mouseout', (d) => {
          d3.selectAll('.np-label').style('display', 'none')
        })
        .call(d3.drag()
            .on('start', this.dragStart)
            .on('drag', this.dragMove)
            .on('end', this.dragEnd))

    this._circles = this._nodes
      .append('circle')
        .attr('r', 2)
        .attr('fill', d => color(d.group))

    this._labels = this._nodes
      .append('text')
      .classed('np-label', true)
      .style('display', 'none')
      .attr('dy', '.35em')
      .text(d => d.id)

    this.simulation.nodes(this.graph.nodes)
      .on('tick', this.handleTick)
    this.simulation.force('link')
      .links(this.graph.links)
  }

  updateGraph () {
    const { stage, tissue } = this.state
    const stage_id = STAGES[stage].toLowerCase()
    return request({ url: `/data/expression/${stage_id}/${tissue}.json`})
      .then(resp => {
        this.expression = resp
        this.simulation.alphaTarget(0.4).restart()
        this._clearCache()
      })
      .fail(() => {
        Toast.show({
          message: 'Could not load the expression weights.',
          intent: Intent.DANGER,
          iconName: 'cross',
        })
      })
  }

  handleTick () {
    this._links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    this._circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', this.computeRadii)
      .style('fill', this.computeColor)
      .style('stroke', this.computeStrokeColor)

    this._labels
      .attr('x', d => d.x + 8)
      .attr('y', d => d.y)
  }

  updateSimulation (alpha) {
    try {
      if (!d3.event.active) {
        this.simulation.alphaTarget(alpha).restart()
      }
    } catch (e) {}
  }

  dragStart (d) {
    this.updateSimulation(0.3)
    d.fx = d.x
    d.fy = d.y
  }

  dragMove (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragEnd (d) {
    this.updateSimulation(0)
    d.fx = null
    d.fy = null
  }

  render () {
    return <svg ref='svg' className='np-svg'></svg>
  }
}

export default Network
