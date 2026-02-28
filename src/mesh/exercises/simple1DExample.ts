import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import CGPP1DMesh from '../Simple1DMesh';

export default function simple1DExample() {
    // const vertices = [
    //     new Vector2(0, 0),
    //     new Vector2(0.5, 0),
    //     new Vector2(1.5, 1),
    //     new Vector2(0, 2.0),
    //     new Vector2(3, 0),
    //     new Vector2(4, 0),
    // ];

    // const edges: [number, number][] = [
    //     [1, 2],
    //     [2, 3],
    //     [3, 4],
    //     [4, 1],
    //     [5, 6]
    // ];

    // const vertices = new Map([
    //     [1, new Vector2(-10, 0)],
    //     [2, new Vector2(0, 10)],
    //     [3, new Vector2(10, 0)]
    // ])

    // const edges = new Map<number, [number, number]>([
    //     [1, [1, 2]],
    //     [2, [2, 3]],
    //     [3, [3, 1]]
    // ])

    const mesh = new CGPP1DMesh();
    mesh.insertVertex(0, 0);
    mesh.insertVertex(0.5, 0);
    mesh.insertVertex(1.5, 1);
    mesh.insertVertex(0, 2.0);

    mesh.insertEdge(0, 1);
    mesh.insertEdge(1, 2);
    mesh.insertEdge(2, 3);
    mesh.insertEdge(3, 0);



    // const points = [
    //     new THREE.Vector2(-10, 0),
    //     new THREE.Vector2(0, 10),
    //     new THREE.Vector2(10, 0),
    //     new THREE.Vector2(-10, 0),
    // ];

    const points = mesh.toPoints();

    console.log(JSON.stringify(points));

    renderPoints(points);
}

function renderPoints(points: Vector3[] | Vector2[]) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const material = new THREE.LineBasicMaterial({color: 0x0000ff});

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    renderer.render(scene, camera);
}