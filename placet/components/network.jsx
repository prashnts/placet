import React, { Component } from 'react'
import { Intent } from '@blueprintjs/core'

import autoBind from 'react-autobind'
import * as d3 from 'd3'
import jquery from 'jquery'

import { request } from '~/placet/mixins'
import { STAGES } from '~/placet/constants'
import { Toast } from '~/placet/utils'

import ExpressionGraph from '~/placet/models/expression-graph'

const color = d3.scaleOrdinal(d3.schemeCategory20)

const degreeOpacityScale = d3.scaleThreshold()
  .domain([0, 1, 5, 10, 20])
  .range([0.1, 0.3, 0.5, 0.9])


class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stage: props.stage,
      tissue: props.tissue,
    }
    this.expression = {}
    this.graph = new ExpressionGraph()

    this.emitLoad = props.onLoad
    autoBind(this)
  }

  componentDidMount () {
    this.svg = d3.select(this.refs.svg)
    const [height, width] = [window.innerHeight, window.innerWidth]
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-1))
      .force('center', d3.forceCenter(width / 2, height / 2))

    request({ url: '/data/network_sigma.json' })
      .then(resp => {
        this.graph.read(resp)
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
      .data(this.graph.edges)
      .enter()
        .append('line')
          .attr('stroke-width', 1)
          .attr('stroke', '#777')
          .attr('stroke-opacity', 0.1)
          .attr('opacity', l => {
            return degreeOpacityScale(Math.max(
              this.graph.degree(l.source),
              this.graph.degree(l.target)
            ))
          })

    this._nodes = this.svg.append('g')
        .attr('class', 'np-graph-nodes')
      .selectAll('circle')
      .data(this.graph.nodes)
      .enter()
        .append('g')
        .on('mouseover', function () {
          d3.select(this).selectAll('.np-label').style('display', '')
        })
        .on('mouseout', () => {
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
        .attr('opacity', d => degreeOpacityScale(this.graph.degree(d.id)))

    this._labels = this._nodes
      .append('g')
      .classed('np-label', true)
      .style('display', 'none')

    this._label_rect = this._labels
      .append('rect')

    this._label_text = this._labels
      .append('text')
      .text(d => d.id)

    let bbx = {}
    this._label_text._groups[0].forEach(el => {
      bbx[el.textContent] = el.getBBox()
    })

    this._label_rect
      .attr('width', d => bbx[d.id].width + 6)    // Offset the width for padding.

    this.simulation.nodes(this.graph.nodes)
      .on('tick', this.handleTick)
    this.simulation.force('link')
      .links(this.graph.edges)
  }

  updateGraph () {
    const { stage, tissue } = this.state
    const stage_id = STAGES[stage].id
    return request({ url: `/data/expression/${stage_id}/${tissue}.json`})
      .then(resp => {
        this.graph.updateWithExpressions(resp)
        this.simulation.alphaTarget(0).restart()
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
      .attr('r', d => d.r)
      .style('fill', d => d.fill)
      .style('stroke', d => d.stroke)

    this._label_text
      .attr('x', d => d.x + 3)
      .attr('y', d => d.y + 2)

    this._label_rect
      .attr('x', d => d.x)
      .attr('y', d => d.y - 12)
  }

  updateSimulation (alpha) {
    try {
      if (!d3.event.active) {
        this.simulation.alphaTarget(alpha).restart()
      }
    } catch (e) {}
  }

  dragStart (d) {
    this.updateSimulation(0.1)
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

  exportSVG () {
    const serializer = new XMLSerializer()
    let svg = this.svg.node().cloneNode(true)
    svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink')
    return serializer.serializeToString(svg)
  }

  render () {
    return <svg ref='svg' className='np-svg'></svg>
  }
}

export default Network
