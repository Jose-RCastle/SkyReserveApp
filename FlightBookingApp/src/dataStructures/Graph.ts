import Queue from "./Queue";

type GraphEdge<T> = {
  vertex: string;
  weight?: number;
  data?: T;
};

type GraphVertex<T> = {
  key: string;
  edges: GraphEdge<T>[];
};

export default class Graph<T = unknown> {
  private vertices: GraphVertex<T>[];

  constructor() {
    this.vertices = [];
  }

  // Busca internamente un vértice por su clave.
  private findVertex(key: string): GraphVertex<T> | null {
    if (!key) return null;
    return this.vertices.find((vertex) => vertex.key === key) ?? null;
  }

  // Agrega un vértice si todavía no existe en el grafo.
  addVertex(key: string): boolean {
    if (!key || this.findVertex(key)) return false;

    this.vertices.push({ key, edges: [] });
    return true;
  }

  // Agrega una conexión entre dos vértices. Por defecto crea una arista dirigida.
  addEdge(from: string, to: string, data?: T, weight?: number, bidirectional: boolean = false): boolean {
    if (!from || !to) return false;

    this.addVertex(from);
    this.addVertex(to);

    const origin = this.findVertex(from);
    const destination = this.findVertex(to);

    if (!origin || !destination) return false;

    if (!origin.edges.some((edge) => edge.vertex === to)) {
      origin.edges.push({ vertex: to, data, weight });
    }

    if (bidirectional && !destination.edges.some((edge) => edge.vertex === from)) {
      destination.edges.push({ vertex: from, data, weight });
    }

    return true;
  }

  // Devuelve los vecinos conectados directamente a un vértice.
  getNeighbors(key: string): GraphEdge<T>[] {
    const vertex = this.findVertex(key);
    return vertex ? [...vertex.edges] : [];
  }

  // Ejecuta BFS para encontrar la ruta con menos escalas entre dos vértices.
  bfs(start: string, target: string): string[] {
    if (!start || !target || !this.findVertex(start) || !this.findVertex(target)) {
      return [];
    }

    const queue = new Queue<string>();
    queue.enqueue(start);

    const visited: string[] = [start];
    const previous: Array<{ key: string; previous: string | null }> = [
      { key: start, previous: null },
    ];

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      if (!current) continue;

      if (current === target) {
        return this.buildPath(previous, target);
      }

      const neighbors = this.getNeighbors(current);

      neighbors.forEach((edge) => {
        if (!visited.includes(edge.vertex)) {
          visited.push(edge.vertex);
          previous.push({ key: edge.vertex, previous: current });
          queue.enqueue(edge.vertex);
        }
      });
    }

    return [];
  }

  // Reconstruye la ruta encontrada por BFS desde el destino hasta el origen.
  private buildPath(previous: Array<{ key: string; previous: string | null }>, target: string): string[] {
    const path: string[] = [];
    let current: string | null = target;

    while (current) {
      path.unshift(current);
      const record = previous.find((item) => item.key === current);
      current = record ? record.previous : null;
    }

    return path;
  }

  // Devuelve la cantidad de vértices del grafo.
  size(): number {
    return this.vertices.length;
  }

  // Indica si el grafo no contiene vértices.
  isEmpty(): boolean {
    return this.vertices.length === 0;
  }

  // Convierte la lista de adyacencia a arreglo para inspección o renderizado.
  toArray(): Array<{ key: string; neighbors: GraphEdge<T>[] }> {
    return this.vertices.map((vertex) => ({
      key: vertex.key,
      neighbors: [...vertex.edges],
    }));
  }
}
