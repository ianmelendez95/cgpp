import * as THREE from 'three';
import {Vector2} from 'three';
import VertexEdge1DMesh from '../mesh/VertexEdge1DMesh';
import { buildGrid } from '../three/objects';

export default function initDrawMesh() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    const {scene, renderer, camera, viewHeight, viewWidth} = initThree(canvas);

    // setup the grid
    const grid = buildGrid(viewWidth, viewHeight);

    const workingMesh = new THREE.Object3D();

    // create meshes
    let mesh = buildSquareMesh(new Vector2(-10, -10), 20);

    let {points, segments} = meshToPointSegments(mesh);

    workingMesh.add(points, segments);

    const nearestVertex = mesh.getVertexPoint(0);
    const nearestVertexBuffer = new THREE.Float32BufferAttribute([nearestVertex.x, nearestVertex.y, 0], 3);
    const nearestVertexGeometry = new THREE.BufferGeometry();
    nearestVertexGeometry.setAttribute('position', nearestVertexBuffer);
    const nearestVertexPoint = new THREE.Points(
        nearestVertexGeometry,
        new THREE.PointsMaterial({sizeAttenuation: false, color: 0xff0000, size: 12})
    );

    const selectedVertex = nearestVertex.clone();
    const selectedVertexBuffer = new THREE.Float32BufferAttribute([selectedVertex.x, selectedVertex.y, 0], 3);
    const selectedVertexGeometry = new THREE.BufferGeometry();
    selectedVertexGeometry.setAttribute('position', selectedVertexBuffer);
    const selectedVertexPoint = new THREE.Points(
        selectedVertexGeometry,
        new THREE.PointsMaterial({sizeAttenuation: false, color: 0x00ff00, size: 10})
    );

    scene.add(grid, workingMesh, nearestVertexPoint, selectedVertexPoint);
    renderer.render(scene, camera);

    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();
    window.addEventListener('mousemove', (event: MouseEvent) => {
        const ndcMousePos = getNDCMousePos(canvas, event.clientX, event.clientY);
        raycaster.setFromCamera(
            ndcMousePos, 
            camera
        );

        const [intersection] = raycaster.intersectObject(grid, false);
        if (intersection) {
            mousePos.set(intersection.point.x, intersection.point.y);

            const {position, distance} = mesh.findNearestVertex(mousePos);
            if (distance < 10) {
                nearestVertex.set(position.x, position.y);
                nearestVertexBuffer.setXY(0, nearestVertex.x, nearestVertex.y);
                nearestVertexBuffer.needsUpdate = true;
            }

            renderer.render(scene, camera);
        }
    });

    canvas.addEventListener('click', (event) => {
    });
}

function getNDCMousePos(canvas: HTMLCanvasElement, mouseX: number, mouseY: number): THREE.Vector2 {
        const rect = canvas.getBoundingClientRect();

        const xRatio = (mouseX - rect.left) / rect.width;
        const yRatio = (mouseY - rect.top) / rect.height;

        const xNorm = (xRatio * 2) - 1;
        const yNorm = -2 * yRatio + 1;

        return new THREE.Vector2(xNorm, yNorm);
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
    scene: THREE.Scene,
    viewWidth: number,
    viewHeight: number
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
        desiredHalfHeight, 
        -desiredHalfHeight, 
        1, 
        1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    return {
        renderer,
        camera,
        scene,
        viewWidth: desiredHalfWidth * 2,
        viewHeight: desiredHalfHeight * 2
    }
}

initDrawMesh();