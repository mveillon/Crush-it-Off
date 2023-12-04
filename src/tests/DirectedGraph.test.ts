import DirectedGraph from "../structs/DirectedGraph"

test("graph", () => {
  const graph = new DirectedGraph()
  expect(graph.numVertices).toBe(0)

  expect(() => graph.hasEdge(0, 0)).toThrow()

  graph.addVertex()

  const invalidInds: [number, number][] = [
    [-1,  0],
    [ 0, -1],
    [ 1,  0],
    [ 0,  1]
  ]
  for (const inds of invalidInds) {
    expect(() => graph.hasEdge(...inds)).toThrow()
    expect(() => graph.addEdge(...inds)).toThrow()
    expect(() => graph.removeEdge(...inds)).toThrow()
  }
  
  expect(graph.numVertices).toBe(1)
  expect(graph.hasEdge(0, 0)).toBeFalsy()
  graph.addEdge(0, 0)
  expect(graph.hasEdge(0, 0)).toBeTruthy()

  for (const inds of invalidInds) {
    expect(() => graph.removeEdge(...inds)).toThrow()

  }

  graph.addVertex()
  expect(graph.numVertices).toBe(2)
  expect(graph.hasEdge(0, 1)).toBeFalsy()
  expect(graph.hasEdge(1, 0)).toBeFalsy()
  graph.addEdge(1, 0)
  expect(graph.hasEdge(1, 0)).toBeTruthy()
  expect(graph.hasEdge(0, 1)).toBeFalsy()
  expect(() => graph.removeEdge(0, 1)).toThrow()

  graph.removeEdge(1, 0)
  expect(graph.hasEdge(1, 0)).toBeFalsy()
})

test("Big graph", () => {
  const graph = new DirectedGraph()
  const numVerts = 20
  for (let i = 0; i < numVerts; i++) {
    expect(graph.numVertices).toBe(i)
    graph.addVertex()
    expect(graph.numVertices).toBe(i + 1)
  }

  for (let i = 0; i < numVerts; i++) {
    for (let j = 1; j < 6; j++) {
      const to = (i + j) % numVerts
      graph.addEdge(i, to)
      expect(graph.hasEdge(i, to)).toBeTruthy()
      expect(graph.hasEdge(to, i)).toBeFalsy()
    }

    for (let j = 1; j < 6; j++) {
      const to = (i + j) % numVerts
      // make sure edges didn't disappear
      expect(graph.hasEdge(i, to)).toBeTruthy()
    }
  }

  for (let i = 0; i < numVerts; i++) {
    const to = (i + 3) % numVerts
    graph.removeEdge(i, to)
    expect(graph.hasEdge(i, to)).toBeFalsy()
    for (let j = 1; j < 6; j++) {
      expect(j === 3 || graph.hasEdge(i, (i + j) % numVerts)).toBeTruthy()
    }
  }
})