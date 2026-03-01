import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import VertexEdge1DMesh from '../VertexEdge1DMesh';

export default function simple1DExample() {
    const threeContext = initContext();

    const btn1 = document.getElementById('toolbar-button-1')! as HTMLButtonElement;
    btn1.innerText = 'Subdivide';
    const mesh = getSquare(new Vector2(0, 0), 10);

    console.log("TRACE mesh");
    mesh.printDebug();

    const points = mesh.toPoints();
    renderPoints(threeContext, points);

    btn1.addEventListener('click', () => {
        mesh.subdivideManifold(0.5);
        renderPoints(threeContext, mesh.toPoints());
    });
}

function getSquare(pos: Vector2, sideL: number) {
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

function getGCPPExample1(): VertexEdge1DMesh {
    const mesh = new VertexEdge1DMesh();
    mesh.insertVertex(0, 0);
    mesh.insertVertex(0.5, 0);
    mesh.insertVertex(1.5, 1);
    mesh.insertVertex(0, 2.0);

    mesh.insertEdge(0, 1);
    mesh.insertEdge(1, 2);
    mesh.insertEdge(2, 3);
    mesh.insertEdge(3, 0);

    mesh.verifyManifold();

    return mesh;

    // const points = [
    //     new THREE.Vector2(-10, 0),
    //     new THREE.Vector2(0, 10),
    //     new THREE.Vector2(10, 0),
    //     new THREE.Vector2(-10, 0),
    // ];
}

function renderPoints({renderer, camera, scene}: ThreeContext, points: Vector3[] | Vector2[]) {
    const material = new THREE.LineBasicMaterial({color: 0xffffff});

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    renderer.render(scene, camera);
}

type ThreeContext = {
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    scene: THREE.Scene
}

function initContext(): ThreeContext {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;

    const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 1, 500 );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2e2e2e);

    return {
        renderer,
        camera,
        scene
    };
}