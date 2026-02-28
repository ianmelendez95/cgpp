import {Vector2} from 'three';

export default class Simple1DMesh {
    vertices: Vector2[];
    edges: [number, number][];

    constructor(
        vertices: Vector2[] = [],
        edges: [number, number][] = []
    ) {
        this.vertices = vertices;
        this.edges = edges;
    }

    toPoints(): Vector2[] {
        const points: Vector2[] = []
        for (const [start, end] of this.edges) {
            points.push(
                this.vertices[start]!,
                this.vertices[end]!
            )
        }
        return points;
    }
}