import * as THREE from 'three';

export default function pong() {
}

class Pong { 
    readonly scene: THREE.Scene;
    readonly renderer: THREE.WebGLRenderer;
    readonly camera: THREE.Camera;

    readonly court: Court;
    readonly playerPaddle: Paddle;

    constructor() {
        const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
        const {renderer, camera, scene} = Pong.initThree(canvas);

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.playerPaddle = new Paddle();
        this.playerPaddle.position.set(-300, 0, 0);

        this.court = new Court();

        this.scene.add(
            this.playerPaddle.object,
            this.court.walls
        );
    }

    start() {
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

class Court {
    readonly walls: THREE.Group;

    readonly northWall: THREE.Object3D;
    readonly southWall: THREE.Object3D;
    readonly eastWall: THREE.Object3D;
    readonly westWall: THREE.Object3D;

    courtWidth: number = 800;
    courtHeight: number = 400;

    wallThickness: number = 5;
    wallHeight: number = 20;

    constructor () {
        const northSouthGeometry = new THREE.BoxGeometry(this.courtWidth, this.wallThickness, this.wallHeight);
        const eastWestGeometry = new THREE.BoxGeometry(this.wallThickness, this.courtHeight, this.wallHeight);
        const wallMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        this.northWall = new THREE.Mesh(northSouthGeometry, wallMaterial);
        this.southWall = new THREE.Mesh(northSouthGeometry, wallMaterial);
        this.eastWall = new THREE.Mesh(eastWestGeometry, wallMaterial);
        this.westWall = new THREE.Mesh(eastWestGeometry, wallMaterial);

        this.northWall.position.setY(this.courtHeight / 2);
        this.southWall.position.setY(-(this.courtHeight / 2));

        this.eastWall.position.setX(this.courtWidth / 2);
        this.westWall.position.setX(-(this.courtWidth / 2));

        this.walls = new THREE.Group();
        this.walls.add(
            this.northWall,
            this.eastWall,
            this.southWall,
            this.westWall
        );
    }
}

class Paddle {
    readonly object: THREE.Object3D;
    readonly position: THREE.Vector3;
    
    width: number = 10;
    height: number = 100;
    depth: number = 10;

    constructor () {
        const paddleGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const paddleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.object = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.position = this.object.position;
    }


}

new Pong().start();
