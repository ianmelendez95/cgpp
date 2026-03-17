import * as THREE from 'three';

export default function pong() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    const {renderer, camera, scene} = initThree(canvas);

    const paddleGeometry = new THREE.BoxGeometry(10, 100, 10);
    const paddleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.set(0, 0, 0);

    scene.add(paddle);

    renderer.render(scene, camera);
}

function initThree(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({
        antialias: false, 
        canvas
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(
        50,
        canvas.clientWidth / canvas.clientHeight,
        1, 
        1000);
    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2e2e2e);

    return {
        renderer,
        camera,
        scene
    }
}

pong();