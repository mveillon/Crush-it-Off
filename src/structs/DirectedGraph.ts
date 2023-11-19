class DirectedGraph {
  private _vertices: number[][]

  get numVertices() {
    return this._vertices.length
  }

  constructor() {
    this._vertices = []
  }

  /**
   * Adds a vertex to the graph with no edges
   */
  addVertex() {
    this._vertices.push([])
  }

  /**
   * Makes sure the vertex is in the graph and errors otherwise
   * @param vert the vertex to check
   */
  private _checkVert(vert: number) {
    if (vert < 0 || vert >= this.numVertices) {
      throw new Error(`Vertex not present in graph ${vert}`)
    }
  }

  /**
   * Adds a directed edge starting from `from` and ending at `to`
   * @param from the node to start at
   * @param to the node to end at
   */
  addEdge(from: number, to: number) {
    this._checkVert(from)
    this._checkVert(to)

    if (!this.hasEdge(from, to)) {
      this._vertices[from].push(to)
    }
  }

  /**
   * Checks if there is an edge going from `from` to `to`
   * @param from the node to start at
   * @param to the node to end at
   * @returns whether the edge is present
   */
  hasEdge(from: number, to: number): boolean {
    this._checkVert(from)
    this._checkVert(to)

    return this._vertices[from].includes(to)
  }

  /**
   * Removes the edge from the graph. Errors if the edge is not present
   * @param from the starting vertex of the edge to remove
   * @param to the ending vertex of the edge to remove
   */
  removeEdge(from: number, to: number) {
    this._checkVert(from)
    this._checkVert(to)
    if (!this.hasEdge(from, to)) {
      throw new Error(`No edge present from ${from} to ${to}`)
    }

    const index = this._vertices[from].indexOf(to)
    this._vertices[from].splice(index, 1)
  }
}

export default DirectedGraph
