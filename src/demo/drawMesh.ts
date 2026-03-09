import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import VertexEdge1DMesh from '../mesh/VertexEdge1DMesh';
import { newGridObjs, newPointsObj, buildSegments } from '../three/objects';

export default function initSubdivideDemo() {
    const threeContext = new ThreeContext();

    // setup the grid
    const gridObjs = newGridObjs(-50, 50, 1);

    // create meshes
    let mesh = buildSquareMesh(new Vector2(-5, -5), 10);

    let {points, segments} = meshToPointSegments(mesh);

    threeContext.scene.add(
        ...gridObjs,
        points,
        segments
    );
    threeContext.render();
}

function meshToPointSegments(mesh: VertexEdge1DMesh): {points: THREE.Points, segments: THREE.LineSegments} {
    const vertices = mesh.getVertices();
    const edges = mesh.getEdgeVertices();

    const points = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(vertices),
        new THREE.PointsMaterial({
            sizeAttenuation: false,
            color: 0xffffff,
            size: 10
        })
    );

    const segments = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(edges.flat()),
        new THREE.LineBasicMaterial({color: 0xffffff})
    );

    return {points, segments};
}


function buildSquareMesh(pos: Vector2, sideL: number): VertexEdge1DMesh {
    const minX = pos.x;
    const maxX = pos.x + sideL;
    const minY = pos.y;
    const maxY = pos.y + sideL;

    const mesh = new VertexEdge1DMesh();
    mesh.insertVertex(minX, minY);
    mesh.insertVertex(minX, maxY);
    mesh.insertVertex(maxX, maxY);
    mesh.insertVertex(maxX, minY);

    mesh.insertEdge(0, 1);
    mesh.insertEdge(1, 2);
    mesh.insertEdge(2, 3);
    mesh.insertEdge(3, 0);

    return mesh;
}

class ThreeContext {
    renderer: THREE.WebGLRenderer;
    camera: THREE.Camera;
    scene: THREE.Scene;

    constructor() {
        const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;

        const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 1, 500 );
        camera.position.set(0, 0, 25);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2e2e2e);

        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
    }

    clearScene() {
        this.scene.clear();
        // const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x2e2e2e);

        // this.scene = scene;
    }

    addObjects(...objects: THREE.Object3D[]) {
        this.scene.add(...objects);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

initSubdivideDemo();
