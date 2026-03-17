import * as THREE from 'three';

export default function pong() {
    const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
    const {renderer, camera, scene} = initThree(canvas);

    renderer.render(scene, camera);
}

function initThree(canvas: HTMLCanvasElement) {
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
    scene.background = new THREE.Color(0x2e2e2e);

    return {
        renderer,
        camera,
        scene,
        viewWidth: desiredHalfWidth * 2,
        viewHeight: desiredHalfHeight * 2
    }
}

pong();