import {Vector2} from 'three';

export default class Simple1DMesh {
    vertices: Vector2[] = [];
    edges: [number, number][] = [];
    neighborList: number[][] = [];

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
        this.neighborList.push([]);
    }

    insertEdge(v1: number, v2: number) {
        const edge = this.edges.push([v1, v2]) - 1;

        // update neighbors
        this.neighborList[v1].push(edge);
        this.neighborList[v2].push(edge);
    }

    toString() {
        
    }
}