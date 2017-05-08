import SigmaGraph from 'sigma/src/classes/sigma.classes.graph'

import objectKeys from 'lodash/keys'
import objectValues from 'lodash/values'


SigmaGraph.addMethod('getNodeIds', function () {
  return objectKeys(this.nodesIndex)
})

SigmaGraph.addMethod('updateNodeAttr', function (id, attr, value) {
  if (this.nodesIndex[id][attr] !== value) {
    this.nodesIndex[id][attr] = value
    this._recomputeNodeAttrs(id)
  }
})

SigmaGraph.addMethod('addComputedNodeAttr', function (name, callback) {
  if (!this.__computedNodeAttrs) {
    this.__computedNodeAttrs = {}
  }
  this.__computedNodeAttrs[name] = id => {
    let node = this.nodesIndex[id]
    node[name] = callback(node)
  }
})

SigmaGraph.addMethod('_recomputeNodeAttrs', function (id) {
  if (this.__computedNodeAttrs) {
    objectValues(this.__computedNodeAttrs).forEach(fn => fn(id))
  }
})

SigmaGraph.addMethod('initComputedNodeAttr', function () {
  this.getNodeIds().forEach(this._recomputeNodeAttrs)
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

    this.node = this._g.nodes
    this.edge = this._g.edges
    this.degree = this._g.degree
    this.read = this._g.read
  }

  get nodes () {
    return this._g.nodes()
  }

  get edges () {
    return this._g.edges()
  }
}

export default Graph
export { SigmaGraph }
