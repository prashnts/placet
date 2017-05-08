import { expect } from 'chai'

import Graph, { SigmaGraph } from '~/placet/components/graph'

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
  })

  describe('#getNodeIds', function () {
    it('Returns node ids', function () {
      expect(g.getNodeIds()).to.deep.equal(['n0', 'n1', 'n2', 'n3'])
    })
  })
})


describe('Graph Model', function () {
  it('Can initialize with a graph', function () {
    const g = new Graph({ graph: graph_stub })
    expect(g.nodes).to.deep.equal(graph_stub.nodes)
    expect(g.edges).to.deep.equal(graph_stub.edges)
  })

  it('Allows reading graph', function () {
    const g = new Graph()
    expect(g.nodes).to.deep.equal([])
    expect(g.edges).to.deep.equal([])
    g.read(graph_stub)
    expect(g.nodes).to.deep.equal(graph_stub.nodes)
    expect(g.edges).to.deep.equal(graph_stub.edges)
  })

  it('Has degree helpers', function () {
    const g = new Graph({ graph: graph_stub })
    expect(g.degree('n0')).to.equal(2)
  })
})