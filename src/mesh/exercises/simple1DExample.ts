import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import VertexEdge1DMesh from '../VertexEdge1DMesh';
import { newGridObjs, newPointsObj, newSegmentsObj } from '../../three/objects';

export default function simple1DExample() {
    const threeContext = new ThreeContext();

    // setup the grid
    const gridObjs = newGridObjs(-50, 50, 1);

    // initialize inputs
    initAlphaEl();
    initSubdivideEl();

    // create meshes
    let mesh = getSquareMesh(new Vector2(-5, -5), 10);
    let subdivMesh = mesh.subdividedManifold(readAlpha());

    // create Three objs
    let mainObj = newSegmentsObj(mesh.toPoints());
    let subdivObj = newSegmentsObj(subdivMesh.toPoints(), {dashed: true});

    threeContext.scene.add(
        ...gridObjs,
        mainObj, 
        subdivObj
    );
    threeContext.render();

    onSubdivide(() => {
        mesh = subdivMesh;
        subdivMesh = mesh.subdividedManifold(readAlpha());

        // mainObj.geometry.setFromPoints(mesh.toPoints());
        // subdivObj.geometry.setFromPoints(subdivMesh.toPoints());

        mainObj = newSegmentsObj(mesh.toPoints());
        subdivObj = newSegmentsObj(subdivMesh.toPoints(), {dashed: true});

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
    return document.getElementById('toolbar-button-1')! as HTMLInputElement;
}

function initAlphaEl() {
    const input2 = getAlphaEl();
    input2.value = '0.5';
    input2.type = "number";
    input2.max = '1';
    input2.min = '0';
    input2.step = '0.05';
}

function readAlpha(): number {
    return parseFloat(getAlphaEl().value);
}

function getAlphaEl(): HTMLInputElement {
    return document.getElementById('toolbar-button-2')! as HTMLInputElement;
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

// function initContext(): ThreeContext {
//     const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;

//     const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);

//     const camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 1, 500 );
//     camera.position.set(0, 0, 100);
//     camera.lookAt(0, 0, 0);

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x2e2e2e);

//     return {
//         renderer,
//         camera,
//         scene
//     };
// }