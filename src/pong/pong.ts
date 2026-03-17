import * as THREE from 'three';

export default function pong() {
}

class Pong { 
    readonly scene: THREE.Scene;
    readonly renderer: THREE.WebGLRenderer;
    readonly camera: THREE.Camera;

    readonly playerPaddle: Paddle;

    constructor() {
        const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
        const {renderer, camera, scene} = Pong.initThree(canvas);

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.playerPaddle = new Paddle();
        this.playerPaddle.position.set(-300, 0, 0);

    }

    start() {
        this.scene.add(this.playerPaddle.object);
        this.renderer.render(this.scene, this.camera);
    }

    static initThree(canvas: HTMLCanvasElement) {
        const renderer = new THREE.WebGLRenderer({
            antialias: false, 
            canvas
        });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            1, 
            1000);
        camera.position.set(0, 0, 500);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2e2e2e);

        return {
            renderer,
            camera,
            scene
        }
    }

}

class Paddle {
    readonly object: THREE.Object3D;
    readonly position: THREE.Vector3;

    constructor () {
        const paddleGeometry = new THREE.BoxGeometry(10, 100, 10);
        const paddleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.object = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.position = this.object.position;
    }


}

new Pong().start();
