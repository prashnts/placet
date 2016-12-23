import React, { Component } from 'react'

import autoBind from 'react-autobind'
import * as d3 from 'd3'

// Sample data
const GRAPH = {
  'nodes': [
    {'id': 'red'},
    {'id': 'orange'},
    {'id': 'yellow'},
    {'id': 'green'},
    {'id': 'blue'},
    {'id': 'violet'},
  ],
  'links': [
    {'source': 'red', 'target': 'yellow', 'value': 2},
    {'source': 'red', 'target': 'blue', 'value': 2},
    {'source': 'red', 'target': 'green', 'value': 2},
    {'source': 'green', 'target': 'orange', 'value': 2},
    {'source': 'orange', 'target': 'violet', 'value': 2},
  ],
}


class Network extends Component {
  constructor (props) {
    super(props)
    this.emitLoad = props.onLoad
    autoBind(this)
  }

  componentDidMount () {
    this.svg = d3.select(this.refs.svg)
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(400, 300))
    this.drawGraph()

    this.emitLoad(true)
  }

  drawGraph () {
    let link = this.svg.append('g')
        .attr('class', 'np-graph-links')
      .selectAll('lines')
      .data(GRAPH.links)
      .enter()
        .append('line')
          .attr('stroke-width', d => Math.sqrt(d.value))

    let node = this.svg.append('g')
        .attr('class', 'np-graph-nodes')
      .selectAll('circle')
      .data(GRAPH.nodes)
      .enter()
        .append('circle')
          .attr('r', 10)
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

    this.simulation.nodes(GRAPH.nodes)
      .on('tick', _tick)

    this.simulation.force('link')
      .links(GRAPH.links)
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
