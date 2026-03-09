import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import VertexEdge1DMesh from '../mesh/VertexEdge1DMesh';
import { buildGrid, newPointsObj, buildSegments } from '../three/objects';

export default function initSubdivideDemo() {
    const threeContext = new ThreeContext();

    // setup the grid
    const gridObjs = buildGrid(-50, 50, 1);

    // initialize inputs
    initAlphaEl();
    initSubdivideEl();

    // create meshes
    let mesh = getSquareMesh(new Vector2(-5, -5), 10);
    let subdivMesh = mesh.subdividedManifold(readAlpha());

    // create Three objs
    let mainObj = buildSegments(mesh.toSegments());
    let subdivObj = buildSegments(subdivMesh.toSegments(), {dashed: true});

    threeContext.scene.add(
        ...gridObjs,
        mainObj, 
        subdivObj
    );
    threeContext.render();

    onAlphaChange((newAlpha) => {
        subdivMesh = mesh.subdividedManifold(newAlpha);
        subdivObj.geometry.setFromPoints(subdivMesh.toSegments());
        threeContext.render();
    });

    onSubdivide(() => {
        mesh = subdivMesh;
        subdivMesh = mesh.subdividedManifold(readAlpha());

        mainObj = buildSegments(mesh.toSegments());
        subdivObj = buildSegments(subdivMesh.toSegments(), {dashed: true});

        threeContext.scene.clear();
        threeContext.scene.add(
            ...gridObjs,
            mainObj, 
            subdivObj
        );

        threeContext.render();
    });
}

function initSubdivideEl() {
    const input1 = getSubdivideEl();
    input1.type = "button";
    input1.value = 'Subdivide';
}

function onSubdivide(callback: () => void) {
    const input1 = getSubdivideEl();
    input1.addEventListener('click', callback);
}

function getSubdivideEl(): HTMLInputElement {
    return document.getElementById('subdivide-button')! as HTMLInputElement;
}

function initAlphaEl() {
    const alpha = getAlphaEl();

    const alphaDisplay = document.getElementById('alpha-display')! as HTMLDivElement;
    alpha.addEventListener('input', (event) => {
        alphaDisplay.textContent = (event.target as HTMLInputElement).value;
    });
}

function onAlphaChange(callback: (newAlpha: number) => void) {
    getAlphaEl().addEventListener('input', (event) => {
        callback(parseFloat((event.target as HTMLInputElement).value))
    })
}

function readAlpha(): number {
    return parseFloat(getAlphaEl().value);
}

function getAlphaEl(): HTMLInputElement {
    return document.getElementById('alpha-range')! as HTMLInputElement;
}

function getSquareMesh(pos: Vector2, sideL: number): VertexEdge1DMesh {
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