import {Vector2} from 'three';

export default class Simple1DMesh {
    vertices: Map<number, Vector2> = new Map();
    edges: Map<number, [number, number]> = new Map();

    constructor(
        vertices: Map<number, Vector2>,
        edges: Map<number, [number, number]>
    ) {
        this.vertices = vertices;
        this.edges = edges;
    }
}