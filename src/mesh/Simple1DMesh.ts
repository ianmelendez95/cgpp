import {Vector2} from 'three';

export default class Simple1DMesh {
    vertices: Vector2[] = [];
    edges: [number, number][] = [];
    neighbors: number[][] = [];

    constructor() {}

    toPoints(): Vector2[] {
        const points: Vector2[] = []
        for (const [start, end] of this.edges) {
            points.push(
                this.vertices[start],
                this.vertices[end]
            );
        };
        return points;
    }

    insertVertex(x: number, y: number) {
        this.vertices.push(new Vector2(x, y));
        this.neighbors.push([]);
    }

    insertEdge(v1: number, v2: number) {
        const edge = this.edges.push([v1, v2]) - 1;

        // update neighbors
        this.neighbors[v1].push(edge);
        this.neighbors[v2].push(edge);
    }

    printDebug() {
        console.table(this.vertices.map((v) => ({vertex: `(${v.x}, ${v.y})`})));
        console.table(this.edges.map(([v1, v2]) => ({edge: `(${v1}, ${v2})`})));
        console.table(this.neighbors.map(([e1, e2]) => ({edge: `(${e1}, ${e2})`})));
    }
}