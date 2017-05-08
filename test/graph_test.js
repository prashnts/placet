import { expect } from 'chai'

import Graph, { SigmaGraph } from '~/placet/models/graph'

const graph_stub = {
  nodes: [
    { id: 'n0' },
    { id: 'n1' },
    { id: 'n2' },
    { id: 'n3' },
  ],
  edges: [
    { id: 'e0', source: 'n0', target: 'n1' },
    { id: 'e1', source: 'n2', target: 'n3' },
    { id: 'e2', source: 'n2', target: 'n1' },
    { id: 'e3', source: 'n3', target: 'n0' },
  ],
}

describe('SigmaGraph', function () {
  let g

  beforeEach('initialize g', function () {
    g = new SigmaGraph()
    g.read(graph_stub)
  })

  describe('#updateNodeAttr', function () {
    it('Mutates internal node state', function () {
      g.updateNodeAttr('n0', 'answer', 42)
      expect(g.nodes('n0')).to.have.property('answer').that.equals(42)
    })

    it('Updates computed attributes when node is updated', function () {
      g.addComputedNodeAttr('r', n => g.degree(n.id) * (n.e || 0))
      g.initComputedNodeAttr()

      expect(g.nodes().map(n => n.r)).to.deep.equal([0, 0, 0, 0])

      g.updateNodeAttr('n2', 'e', 2)

      expect(g.nodes('n2').r).to.equal(2 * 2)
    })
  })

  describe('#getNodeIds', function () {
    it('Returns node ids', function () {
      expect(g.getNodeIds()).to.deep.equal(['n0', 'n1', 'n2', 'n3'])
    })
  })

  describe('#addComputedNodeAttr', function () {
    it('Can add computed attributes', function () {
      g.addComputedNodeAttr('label', node => node.id )
      g.addComputedNodeAttr('foo', () => 'bar' )
      g._recomputeNodeAttrs('n0')
      expect(g.nodes('n0')).to.have.property('label').that.equals('n0')
      expect(g.nodes('n0')).to.have.property('foo').that.equals('bar')
    })
  })

  describe('#initComputedNodeAttr', function () {
    it('Initializes all computed attributes', function () {
      g.addComputedNodeAttr('label', node => `yo-${node.id}` )
      g.initComputedNodeAttr()
      expect(g.nodes().map(n => n.label))
        .to.deep.equal(['yo-n0', 'yo-n1', 'yo-n2', 'yo-n3'])
    })
  })
})


describe('Graph Model', function () {
  describe('#function aliases', function () {
    const g = new Graph({ graph: graph_stub })

    it('Has correct aliases', function () {
      expect(g).to.respondTo('node')
      expect(g).to.respondTo('edge')
      expect(g).to.respondTo('degree')
      expect(g).to.respondTo('read')
    })

    it('Proxies #nodes via #node', function () {
      expect(g.node('n0')).to.deep.equal({ id: 'n0' })
    })

    it('Proxies #edges via #edge', function () {
      expect(g.edge('e0')).to.deep.equal({ id: 'e0', source: 'n0', target: 'n1' })
    })

    it('Proxies #degree', function () {
      expect(g.degree('n0')).to.equal(2)
    })

    it('Proxies #read', function () {
      const gr2 = new Graph()
      expect(gr2.nodes).to.deep.equal([])
      expect(gr2.edges).to.deep.equal([])
      gr2.read(graph_stub)
      expect(gr2.nodes).to.deep.equal(graph_stub.nodes)
      expect(gr2.edges).to.deep.equal(graph_stub.edges)
    })
  })

  it('Can initialize with a graph', function () {
    const g = new Graph({ graph: graph_stub })
    expect(g.nodes).to.deep.equal(graph_stub.nodes)
    expect(g.edges).to.deep.equal(graph_stub.edges)
  })
})