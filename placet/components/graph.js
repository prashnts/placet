import SigmaGraph from 'sigma/src/classes/sigma.classes.graph'
import objectKeys from 'lodash/keys'

SigmaGraph.addMethod('updateNodeAttr', function (id, attr, value) {
  this.nodesIndex[id][attr] = value
})

SigmaGraph.addMethod('getNodeIds', function () {
  return objectKeys(this.nodesIndex)
})


class Graph {
  constructor (props) {
    this._g = new SigmaGraph( key => {
      const settings = { immutable: false, clone: true }
      return settings[key]
    })
    if (props && props.graph) {
      // if initial graph is given, load it.
      this._g.read(props.graph)
    }
    this.degree = this._g.degree
    this.read = this._g.read
  }

  get nodes () {
    return this._g.nodes()
  }

  get edges () {
    return this._g.edges()
  }

  updateWithExpressions (expr) {
    this._g.getNodeIds().forEach(id => {
      this._g.updateNodeAttr(id, 'expr', expr[id] || 0)
    })
  }
}

export default Graph
export { SigmaGraph }
