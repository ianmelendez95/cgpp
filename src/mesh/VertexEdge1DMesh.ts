import {Vector2} from 'three';
import { deleteElem, deleteIdx } from './arrays';

export default class VertexEdge1DMesh {
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

    getVertexPoint(v: number): Vector2 {
        return this.vertices[v];
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

    getNeighborVertices(v: number): number[] {
        return this.getEdgesAtVertex(v).map(e => this.getOtherEnd(v, e));
    }

    getEdgesAtVertex(v: number): number[] {
        return this.neighbors[v];
    }

    getOtherEnd(vertex: number, edge: number): number {
        const [start, end] = this.edges[edge];
        if (vertex === start) {
            return end;
        } else if (vertex === end) {
            return start;
        } else {
            throw new Error(`Vertex not on edge: vertex=${vertex} edge=${edge}`);
        }
    }

    getEdgeEndpoints(edge: number): [Vector2, Vector2] {
        const [start, end] = this.edges[edge];
        return [this.vertices[start], this.vertices[end]];
    }

    deleteEdge(edge: number) {
        const [v1, v2] = deleteIdx(this.edges, edge);
        deleteElem(this.neighbors[v1], edge);
        deleteElem(this.neighbors[v2], edge);
    }

    verifyManifold() {
        if (!this.isManifold()) {
            throw new Error('Not a manifold');
        }
    }

    isManifold() {
        for (const ns of this.neighbors) {
            if (ns.length != 2) {
                return false;
            }
        }

        return true;
    }

    subdivideManifold(alpha: number) {
        this.verifyManifold();

        // v = (alpha/2)*u + (alpha/2)*w + (1 - alpha)*v
        for (let i = 0; i < this.vertices.length; i++) {
            const v: Vector2 = this.vertices[i];
            const [u, w] = this.getNeighborVertices(i).map(j => this.getVertexPoint(j)) as Vector2[];

            v.multiplyScalar(1 - alpha)
                .add(u.clone().multiplyScalar(alpha/2))
                .add(w.clone().multiplyScalar(alpha/2));
        }
    }

    printDebug() {
        console.table(this.vertices.map((v) => ({vertex: `(${v.x}, ${v.y})`})));
        console.table(this.edges.map(([v1, v2]) => ({edge: `(${v1}, ${v2})`})));
        console.table(this.neighbors.map(([e1, e2]) => ({edge: `(${e1}, ${e2})`})));
    }
}