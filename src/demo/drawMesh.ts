import * as THREE from 'three';
import {Vector2} from 'three';
import VertexEdge1DMesh from '../mesh/VertexEdge1DMesh';
import { buildGrid } from '../three/objects';
import { select } from 'three/tsl';
import _ from 'lodash';

export default function initDrawMesh() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    const {scene, renderer, camera, viewHeight, viewWidth} = initThree(canvas);

    // setup the grid
    const grid = buildGrid(viewWidth, viewHeight);

    const workingMesh = new THREE.Group();

    // create meshes
    let mesh = buildSquareMesh(new Vector2(-10, -10), 20);

    let {points, segments} = meshToPointSegments(mesh);

    workingMesh.add(points, segments);

    let nearVertexIndex = -1;
    const nearVertexPoint = new FastPoint();
    nearVertexPoint.material.color.set(0xff0000);
    nearVertexPoint.material.size = 12;
    nearVertexPoint.object.renderOrder = 1;

    let selectedVertexIndex = 0;
    const selectedVertexPoint = new FastPoint(mesh.getVertexPoint(selectedVertexIndex));
    selectedVertexPoint.material.color.set(0x00ff00);
    selectedVertexPoint.material.size = 10;
    selectedVertexPoint.object.renderOrder = 2;

    scene.add(grid, workingMesh, nearVertexPoint.object, selectedVertexPoint.object);
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

            const {index, position, distanceSquared} = mesh.findNearestVertex(mousePos);
            if (distanceSquared < 1) {
                console.log('Near vertex');
                const isSelectedVertex = position.equals(selectedVertexPoint.getPosition());

                selectedVertexPoint.material.size = isSelectedVertex ? 12 : 10;
                nearVertexPoint.updatePosition(position);
                nearVertexIndex = index;
            } else {
                console.log('Not near vertex');
                selectedVertexPoint.material.size = 10;
                nearVertexPoint.hide();
                nearVertexIndex = -1;
            }

            renderer.render(scene, camera);
        }
    });

    canvas.addEventListener('click', (event) => {
        if (event.shiftKey) {
            // adding/connecting a vertex

            if (nearVertexIndex === -1) {
                // not near any point, so add a new vertex
                const newVertexIndex = mesh.insertVertex(mousePos);
                mesh.insertEdge(selectedVertexIndex, newVertexIndex);

                selectedVertexIndex = newVertexIndex;
                selectedVertexPoint.updatePosition(mousePos);
            } else {
                const existingEdge = mesh.findEdge(selectedVertexIndex, nearVertexIndex);
                if (!_.isNil(existingEdge)) {
                    mesh.deleteEdge(existingEdge);
                } else {
                    mesh.insertEdge(selectedVertexIndex, nearVertexIndex);
                }

                selectedVertexIndex = nearVertexIndex;
                selectedVertexPoint.updatePosition(nearVertexPoint.getPosition());
            }

            // recreate mesh in scene
            let {points, segments} = meshToPointSegments(mesh);
            workingMesh.clear();
            workingMesh.add(points, segments);
        } else if (nearVertexIndex !== -1) {
            selectedVertexPoint.copyPosition(nearVertexPoint);
            selectedVertexIndex = nearVertexIndex;
            selectedVertexPoint.material.size = 12;
        }

        renderer.render(scene, camera);
    });
}

class FastPoint {
    static ORIGIN = new Vector2(0, 0);

    buffer: Float32Array;
    attribute: THREE.BufferAttribute;
    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
    object: THREE.Points;

    constructor(initialPosition?: THREE.Vector2) {
        let hide = false;
        if (!initialPosition) {
            hide = true;
            initialPosition = FastPoint.ORIGIN;
        }

        this.geometry = new THREE.BufferGeometry();

        this.buffer = new Float32Array([initialPosition.x, initialPosition.y, 0]);
        this.attribute = new THREE.BufferAttribute(this.buffer, 3);
        this.geometry.setAttribute('position', this.attribute);

        this.material = new THREE.PointsMaterial({sizeAttenuation: false, color: 0xe0e0e0, size: 5})

        this.object = new THREE.Points(this.geometry, this.material);

        if (hide) {
            this.object.visible = false;
        }
    }

    copyPosition(src: FastPoint) {
        this.buffer[0] = src.buffer[0];
        this.buffer[1] = src.buffer[1];
        this.attribute.needsUpdate = true;
    }

    getPosition(): Vector2 {
        return new Vector2(this.buffer[0], this.buffer[1]);
    }

    updatePosition(position: Vector2) {
        this.attribute.setXY(0, position.x, position.y);
        this.attribute.needsUpdate = true;
        this.show();
    }

    hide() {
        this.object.visible = false;
    }

    show() {
        this.object.visible = true;
    }

    isHidden() {
        return !this.object.visible;
    }

    samePosition(that: FastPoint) {
        return this.buffer[0] === that.buffer[0] && this.buffer[1] === that.buffer[1];
    }

    distanceToSquared(position: Vector2) {
        return this.getPosition().distanceToSquared(position);
    }
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