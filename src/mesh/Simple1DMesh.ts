import {Vector2, Vector3} from 'three';

export default class Simple1DMesh {
    vertices: Map<number, Vector2> = new Map();
    edges: Map<number, [number, number]> = new Map();

    constructor(
        vertices: Map<number, Vector2> = new Map(),
        edges: Map<number, [number, number]> = new Map()
    ) {
        this.vertices = vertices;
        this.edges = edges;
    }

    toPoints(): Vector2[] {
        const points: Vector2[] = []
        for (const [, [start, end]] of this.edges) {
            points.push(
                this.vertices.get(start)!,
                this.vertices.get(end)!
            )
        }
        return points;
    }
}