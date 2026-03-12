import {Vector2} from 'three';
import * as THREE from 'three';
import { deleteElem, deleteIdx } from './arrays';

export default class VertexEdge1DMesh {
    vertices: Vector2[] = [];
    edges: [number, number][] = [];
    neighbors: number[][] = [];

    constructor() {}

    clone(): VertexEdge1DMesh {
        const newMesh = new VertexEdge1DMesh();
        newMesh.vertices = this.vertices.map(v => v.clone());
        newMesh.edges = this.edges.map(([v1, v2]) => [v1, v2]);
        newMesh.neighbors = this.neighbors.map(ns => [...ns]);
        return newMesh;
    }

    getVertices(): Vector2[] {
        return [...this.vertices.map(v => v.clone())];
    }

    getEdgeVertices(): [Vector2, Vector2][] {
        return [...this.edges.map(([v1, v2]) => ([
            this.vertices[v1].clone(), 
            this.vertices[v2].clone()
        ] as [Vector2, Vector2]))];
    }

    findNearestVertex(point: Vector2): {index: number, position: Vector2, distanceSquared: number} {
        if (this.vertices.length === 0) {
            throw new Error('No vertices');
        }

        let nearestDistance = this.vertices[0].distanceToSquared(point);
        let nearestVertex = 0;
        for (let i = 1; i < this.vertices.length; i++) {
            const vertexDistance = this.vertices[i].distanceToSquared(point);
            if (vertexDistance < nearestDistance) {
                nearestDistance = vertexDistance;
                nearestVertex = i;
            }
        }

        return {
            index: nearestVertex,
            position: this.vertices[nearestVertex],
            distanceSquared: nearestDistance
        };
    }

    /**
     * @deprecated prefer getEdgeVertices().flat();
     */
    toPoints(): Vector2[] {
        return this.getEdgeVertices().flat();
    }

    getVertexPoint(v: number): Vector2 {
        return this.vertices[v].clone();
    }

    insertVertex(x: number | Vector2, y?: number): number {
        if (typeof x === 'number') {
            this.vertices.push(new Vector2(x, y));
        } else {
            this.vertices.push(x.clone());
        }

        this.neighbors.push([]);
        return this.vertices.length - 1;
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

    findEdge(vertex1: number, vertex2: number): null | number {
        const neighborEdges = this.neighbors[vertex1];
        for (const edge of neighborEdges) {
            const neighborVertex = this.getOtherEnd(vertex1, edge);
            if (neighborVertex === vertex2) {
                return edge;
            }
        }

        return null;
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

    subdividedManifold(alpha: number): VertexEdge1DMesh {
        this.verifyManifold();

        const newMesh = this.clone();

        // v_v = (alpha/2)*u + (alpha/2)*w + (1 - alpha)*v
        for (let vertexIdx = 0; vertexIdx < this.vertices.length; vertexIdx++) {
            const v: Vector2 = this.vertices[vertexIdx];
            const [u, w] = this.getNeighborVertices(vertexIdx).map(j => this.getVertexPoint(j)) as Vector2[];

            const new_v = v.clone().multiplyScalar(1 - alpha)
                .add(u.clone().multiplyScalar(alpha/2))
                .add(w.clone().multiplyScalar(alpha/2));

            newMesh.vertices[vertexIdx] = new_v;
        }

        // now we have to completely recreate edges and neighbors
        newMesh.neighbors = [...new Array(this.vertices.length)].map(() => []);
        newMesh.edges = [];

        // v_e = (t + u)/2
        for (let edgeIdx = 0; edgeIdx < this.edges.length; edgeIdx++) {
            const [v1_i, v2_i] = this.edges[edgeIdx];
            const v1 = this.vertices[v1_i].clone();
            const v2 = this.vertices[v2_i].clone();

            const vNew = v1.add(v2).divideScalar(2);

            const vNew_i = newMesh.insertVertex(vNew);
            newMesh.insertEdge(v1_i, vNew_i);
            newMesh.insertEdge(vNew_i, v2_i);
        }

        return newMesh;
    }

    printDebug() {
        console.table(this.vertices.map((v) => ({vertex: `(${v.x}, ${v.y})`})));
        console.table(this.edges.map(([v1, v2]) => ({edge: `(${v1}, ${v2})`})));
        console.table(this.neighbors.map(([e1, e2]) => ({edge: `(${e1}, ${e2})`})));
    }
}