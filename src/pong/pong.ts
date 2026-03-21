import * as THREE from 'three';
// @ts-ignore
import {OrbitControls} from 'three/addons/controls/OrbitControls';

export default function pong() {
}

const BACKGROUND_COLOR = 0x2e2e2e;
const COURT_FLOOR_COLOR = 0x555555;
const COURT_WALL_COLOR = 0x3fc1c9;
const PADDLE_COLOR = 0xfc5185;

// const SUN_LIGHT_COLOR = 0x409cff;
const SUN_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_COLOR = 0xffffff;

class Pong { 
    readonly canvas: HTMLCanvasElement;
    readonly scene: THREE.Scene;
    readonly renderer: THREE.WebGLRenderer;
    readonly camera: THREE.Camera;

    readonly background: number = BACKGROUND_COLOR;

    readonly court: Court;
    readonly playerPaddle: Paddle;
    readonly ball: Ball;

    constructor() {
        this.canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
        const {renderer, camera, scene} = this.initThree(this.canvas);

        const directional = new THREE.DirectionalLight(SUN_LIGHT_COLOR, 1);
        directional.position.set(-100, 100, 250);
        directional.target.position.set(0, 0, 0);
        directional.target.updateMatrixWorld();
        directional.shadow.camera.far = 500;
        directional.shadow.camera.left = -500;
        directional.shadow.camera.right = 500;
        directional.shadow.camera.top = 250;
        directional.shadow.camera.bottom = -300;
        directional.shadow.mapSize.height = 2048;
        directional.shadow.mapSize.width = 2048;
        directional.castShadow = true;

        const ambient = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, 1);

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.playerPaddle = new Paddle();
        this.playerPaddle.position.setX(-300);

        this.court = new Court();

        this.ball = new Ball();
        this.ball.object.position.setX(-50).setY(90);
        this.ball.object.castShadow = true;
        this.ball.object.receiveShadow = true;

        const directionalHelper = new THREE.DirectionalLightHelper(directional);
        const cameraHelper = new THREE.CameraHelper(directional.shadow.camera);

        this.scene.add(
            ambient,
            directional,
            directional.target,
            this.playerPaddle.object,
            this.court.objects,
            this.ball.object,

            // directionalHelper,
            // cameraHelper
        );

        this.renderLoop = this.renderLoop.bind(this);
    }

    start() {
        new OrbitControls(this.camera, this.renderer.domElement);

        window.requestAnimationFrame(this.renderLoop);
    }

    renderLoop() {
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.renderLoop);
    }

    initThree(canvas: HTMLCanvasElement) {
        const renderer = new THREE.WebGLRenderer({
            antialias: false, 
            canvas
        });
        renderer.shadowMap.enabled = true;

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            1, 
            10000
        );
        camera.position.set(0, 0, 1000);
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(this.background);

        return {
            renderer,
            camera,
            scene
        }
    }
}

class Ball {
    readonly object: THREE.Object3D;

    readonly width: number = 10;
    readonly height: number = 10;
    readonly depth: number = 10;

    readonly color: number = 0xffffff;

    constructor () {
        this.object = new THREE.Mesh(
            new THREE.BoxGeometry(this.width, this.height, this.depth),
            new THREE.MeshPhongMaterial({color: this.color})
        )

        this.object.position.setZ(this.depth / 2);
    }
}

class Court {
    readonly objects: THREE.Group;
    readonly walls: THREE.Group;

    readonly northWall: THREE.Object3D;
    readonly southWall: THREE.Object3D;
    readonly eastWall: THREE.Object3D;
    readonly westWall: THREE.Object3D;

    readonly floor: THREE.Object3D;

    courtWidth: number = 800;
    courtHeight: number = 400;

    wallThickness: number = 5;
    wallHeight: number = 20;
    wallColor: number = COURT_WALL_COLOR;
    floorColor: number = COURT_FLOOR_COLOR;

    floorDepth: number = 10; // TODO: make floor a plane

    constructor () {
        const northSouthGeometry = new THREE.BoxGeometry(this.courtWidth, this.wallThickness, this.wallHeight);
        const eastWestGeometry = new THREE.BoxGeometry(this.wallThickness, this.courtHeight, this.wallHeight);
        const floorGeometry = new THREE.BoxGeometry(this.courtWidth, this.courtHeight, this.floorDepth);
        const wallMaterial = new THREE.MeshPhongMaterial({color: this.wallColor});
        const floorMaterial = new THREE.MeshPhongMaterial({color: this.floorColor});

        this.northWall = new THREE.Mesh(northSouthGeometry, wallMaterial);
        this.southWall = new THREE.Mesh(northSouthGeometry, wallMaterial);
        this.eastWall = new THREE.Mesh(eastWestGeometry, wallMaterial);
        this.westWall = new THREE.Mesh(eastWestGeometry, wallMaterial);

        this.northWall.position.setY(this.courtHeight / 2);
        this.southWall.position.setY(-(this.courtHeight / 2));

        this.eastWall.position.setX(this.courtWidth / 2);
        this.westWall.position.setX(-(this.courtWidth / 2));

        this.northWall.castShadow = true;
        this.eastWall.castShadow = true;
        this.eastWall.receiveShadow = true;
        this.southWall.castShadow = true;
        this.southWall.receiveShadow = true;
        this.westWall.castShadow = true;

        this.walls = new THREE.Group();
        this.walls.add(
            this.northWall,
            this.eastWall,
            this.southWall,
            this.westWall
        );
        this.walls.position.setZ(this.wallHeight / 2);

        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.position.setZ(-(this.floorDepth / 2));
        this.floor.receiveShadow = true;

        this.objects = new THREE.Group();
        this.objects.add(this.walls, this.floor);
    }
}

class Paddle {
    readonly object: THREE.Object3D;
    readonly position: THREE.Vector3;
    
    width: number = 10;
    height: number = 100;
    depth: number = 10;

    paddleColor: number = PADDLE_COLOR;

    constructor () {
        const paddleGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        // const paddleMaterial = new THREE.MeshBasicMaterial({color: this.paddleColor});
        const paddleMaterial = new THREE.MeshPhongMaterial({
            color: this.paddleColor
        })

        this.object = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.object.castShadow = true;

        this.position = this.object.position;
        this.position.setZ(this.depth / 2);
    }
}

new Pong().start();

// const MouseButton = {
//     Left: 1,
//     Right: 2,
//     Wheel: 4,
//     Back: 8,
//     Forward: 16
// } as const

// class CameraPanHelper {
//     readonly canvas: HTMLCanvasElement;
//     readonly camera: THREE.Camera;
//     readonly cameraDir: THREE.Vector3 = new THREE.Vector3();

//     constructor (canvas: HTMLCanvasElement, camera: THREE.Camera) {
//         this.canvas = canvas;
//         this.camera = camera;
//     }

//     start() {
//         this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
//             if (event.buttons & MouseButton.Left) {
//                 this.camera.position.setX(this.camera.position.x - event.movementX);
//                 this.camera.position.setY(this.camera.position.y + event.movementY);
//             } else if (event.buttons & MouseButton.Wheel) {
//                 this.camera.rotation.y += event.movementX / 1000;
//                 this.camera.rotation.x += event.movementY / 1000;
//             }
//         });

//         this.canvas.addEventListener('wheel', (event: WheelEvent) => {
//             console.log('Dollying camera')
//             const cameraMove = this.getCameraDir().multiplyScalar(-event.deltaY);

//             this.camera.position.add(cameraMove);
//         });
//     }

//     getCameraDir(): THREE.Vector3 {
//         this.camera.getWorldDirection(this.cameraDir);
//         return this.cameraDir.clone();
//     }
// }