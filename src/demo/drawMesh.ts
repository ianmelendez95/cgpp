import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import VertexEdge1DMesh from '../mesh/VertexEdge1DMesh';
import { newGridObjs, newPointsObj, buildSegments } from '../three/objects';

export default function initDrawMesh() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    const {scene, renderer, camera} = initThree(canvas);

    // setup the grid
    const gridObjs = newGridObjs(-50, 50, 1);

    // create meshes
    let mesh = buildSquareMesh(new Vector2(-5, -5), 20);

    let {points, segments} = meshToPointSegments(mesh);

    scene.add(
        ...gridObjs,
        points,
        segments
    );
    renderer.render(scene, camera);
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

type ThreeContext = {
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    scene: THREE.Scene
};

function initThree(canvas: HTMLCanvasElement): ThreeContext {
    const renderer = new THREE.WebGLRenderer({
        antialias: false, 
        canvas
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    const desiredHalfHeight = 20;
    const desiredHalfWidth = desiredHalfHeight * aspect;
    const camera = new THREE.OrthographicCamera(
        -desiredHalfWidth, 
        desiredHalfWidth, 
        -desiredHalfHeight, 
        desiredHalfHeight, 
        1, 
        1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2e2e2e);

    return {
        renderer,
        camera,
        scene
    }
}

initDrawMesh();