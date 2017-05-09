import * as d3 from 'd3'

import Graph from './graph'

const coolScheme = d3.interpolateCool
const GREY = d3.color('#ccc')

// -- Adapt this scale to whatever value provides best radius changes.
const radiiScale = d3.scalePow()
  .domain([0, 0.05, 0.10, 0.15, 0.2, 0.4, 0.6, 1])
  .range([5, 15, 20, 25, 30, 35, 40])


class ExpressionGraph extends Graph {
  constructor (props) {
    super(props)
    this._g.addComputedNodeAttr('r', n => n.expr ? radiiScale(n.expr) : 1)
    this._g.addComputedNodeAttr('fill', n => n.expr ? coolScheme(n.expr) : GREY)
    this._g.addComputedNodeAttr('stroke', n => {
      return n.expr ? d3.color(coolScheme(n.expr)).darker(1) : GREY.darker(1)
    })
    this._g.initComputedNodeAttr()
  }

  updateWithExpressions (expr) {
    this._g.getNodeIds().forEach(id => {
      this._g.updateNodeAttr(id, 'expr', expr[id] || 0)
    })
  }
}

export default ExpressionGraph
