import {Vector2} from 'three';
import * as THREE from 'three';
import { deleteElem, deleteIdx } from './arrays';

export default class TriangleMesh {
    vertices: Vector2[] = [];
    triangles: [number, number, number][] = [];
    neighbors: number[][] = [];

    constructor() {}

    clone(): TriangleMesh {
        const newMesh = new TriangleMesh();
        newMesh.vertices = this.vertices.map(v => v.clone());
        newMesh.triangles = this.triangles.map((vs) => [...vs]);
        newMesh.neighbors = this.neighbors.map(ns => [...ns]);
        return newMesh;
    }

    getVertices(): Vector2[] {
        return [...this.vertices.map(v => v.clone())];
    }

    getTriangleVertices(): [Vector2, Vector2, Vector2][] {
        return [...this.triangles.map((vs) => vs.map(v => this.vertices[v].clone()) as [Vector2, Vector2, Vector2])];
    }

    getVertexAndIndexArrays(): {vertex: number[], index: number[]} {
        return {
            vertex: this.vertices.flatMap(v => [v.x, v.y, 0]),
            index: this.triangles.flat()
        }
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

    getVertexPosition(v: number): Vector2 {
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

    insertTriangle(v1: number, v2: number, v3: number) {
        const triangle = this.triangles.push([v1, v2, v3]) - 1;

        // update neighbors
        this.neighbors[v1].push(triangle);
        this.neighbors[v2].push(triangle);
        this.neighbors[v3].push(triangle);
    }

    getNeighborVertices(v: number): number[] {
        return this.getTrianglesAtVertex(v).map(e => this.getOtherVertices(v, e)).flat();
    }

    getTrianglesAtVertex(v: number): number[] {
        return this.neighbors[v];
    }

    getOtherVertices(vertex: number, triangle: number): [number, number] {
        const [v1, v2, v3] = this.triangles[triangle];
        if (vertex === v1) {
            return [v2, v3];
        } else if (vertex === v2) {
            return [v1, v3];
        } else if (vertex === v3) {
            return [v2, v3];
        } else {
            throw new Error(`Vertex not on triangle: vertex=${vertex} triangle=${triangle}`);
        }
    }

    findTriangle(vertex1: number, vertex2: number, vertex3: number): null | number {
        const neighborTris = this.neighbors[vertex1];
        for (const triangle of neighborTris) {
            const [v2, v3] = this.getOtherVertices(vertex1, triangle);
            if ((v2 === vertex2 && v3 === vertex3) || (v2 === vertex3 && v3 === vertex2)) {
                return triangle;
            }
        }

        return null;
    }

    getTrianglePositions(triangle: number): [Vector2, Vector2, Vector2] {
        const [v1, v2, v3] = this.triangles[triangle];
        return [this.vertices[v1], this.vertices[v2], this.vertices[v3]];
    }

    deleteTriangle(triangle: number) {
        const [v1, v2, v3] = deleteIdx(this.triangles, triangle);
        deleteElem(this.neighbors[v1], triangle);
        deleteElem(this.neighbors[v2], triangle);
        deleteElem(this.neighbors[v3], triangle);
    }

    // verifyManifold() {
    //     if (!this.isManifold()) {
    //         throw new Error('Not a manifold');
    //     }
    // }

    // isManifold() {
    //     for (const ns of this.neighbors) {
    //         if (ns.length != 2) {
    //             return false;
    //         }
    //     }

    //     return true;
    // }

    // subdividedManifold(alpha: number): VertexEdge1DMesh {
    //     this.verifyManifold();

    //     const newMesh = this.clone();

    //     // v_v = (alpha/2)*u + (alpha/2)*w + (1 - alpha)*v
    //     for (let vertexIdx = 0; vertexIdx < this.vertices.length; vertexIdx++) {
    //         const v: Vector2 = this.vertices[vertexIdx];
    //         const [u, w] = this.getNeighborVertices(vertexIdx).map(j => this.getVertexPosition(j)) as Vector2[];

    //         const new_v = v.clone().multiplyScalar(1 - alpha)
    //             .add(u.clone().multiplyScalar(alpha/2))
    //             .add(w.clone().multiplyScalar(alpha/2));

    //         newMesh.vertices[vertexIdx] = new_v;
    //     }

    //     // now we have to completely recreate edges and neighbors
    //     newMesh.neighbors = [...new Array(this.vertices.length)].map(() => []);
    //     newMesh.edges = [];

    //     // v_e = (t + u)/2
    //     for (let edgeIdx = 0; edgeIdx < this.edges.length; edgeIdx++) {
    //         const [v1_i, v2_i] = this.edges[edgeIdx];
    //         const v1 = this.vertices[v1_i].clone();
    //         const v2 = this.vertices[v2_i].clone();

    //         const vNew = v1.add(v2).divideScalar(2);

    //         const vNew_i = newMesh.insertVertex(vNew);
    //         newMesh.insertEdge(v1_i, vNew_i);
    //         newMesh.insertEdge(vNew_i, v2_i);
    //     }

    //     return newMesh;
    // }

    toThree(): THREE.Group {
        const {vertex, index} = this.getVertexAndIndexArrays();

        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(vertex, 3))
            .setIndex(index);

        const points = new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                sizeAttenuation: false,
                color: 0xffffff,
                size: 10
            })
        );

        const meshObj = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
        );

        const threeObj = new THREE.Group();
        threeObj.add(points);
        threeObj.add(meshObj);

        return threeObj;
    }

    printDebug() {
        console.table(this.vertices.map((v) => ({vertex: `(${v.x}, ${v.y})`})));
        console.table(this.triangles.map(([v1, v2, v3]) => ({edge: `(${v1}, ${v2}, ${v3})`})));
        console.table(this.neighbors.map(([e1, e2]) => ({edge: `(${e1}, ${e2})`})));
    }
}