import * as THREE from 'three';
import {Vector2} from 'three';
import { buildGrid } from '../three/objects';
import _ from 'lodash';
import TriangleMesh from '../mesh/TriangleMesh';

class DrawMesh2D {
    canvas: HTMLCanvasElement;

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.Camera;

    mesh: TriangleMesh;

    selectedVertexIndex: number;
    selectedVertexPoint: FastPoint;

    nearVertexIndex: number;
    nearVertexPoint: FastPoint;

    tempVertexSelected: null | number | Vector2;
    tempVertexPoint: FastPoint;
    tempVertexLine: FastLine;

    mouseTracker: MouseTracker;

    grid: THREE.Object3D;
    workingMesh: THREE.Group;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        const {renderer, scene, camera, viewHeight, viewWidth} = DrawMesh2D.initThree(this.canvas);

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.mesh = buildSquareMesh(new Vector2(-10, -10), 20);
        this.nearVertexIndex = -1;
        this.tempVertexSelected = null;
        this.selectedVertexIndex = 0;

        this.grid = buildGrid(viewWidth, viewHeight);
        this.workingMesh = new THREE.Group();
        this.workingMesh.add(this.mesh.toThree());

        this.mouseTracker = new MouseTracker(canvas, this.camera, this.grid);

        this.selectedVertexPoint = new FastPoint(this.mesh.getVertexPosition(this.selectedVertexIndex));
        this.selectedVertexPoint.material.color.set(0x00ff00);
        this.selectedVertexPoint.material.size = 10;
        this.selectedVertexPoint.object.renderOrder = 2;

        this.nearVertexPoint = new FastPoint();
        this.nearVertexPoint.material.color.set(0xff0000);
        this.nearVertexPoint.material.size = 12;
        this.nearVertexPoint.object.renderOrder = 1;

        this.tempVertexPoint = new FastPoint();
        this.tempVertexPoint.material.color.set(0xffff00);
        this.tempVertexPoint.material.size = 12;
        this.tempVertexPoint.object.renderOrder = 2;

        this.tempVertexLine = new FastLine();
        this.tempVertexLine.object.renderOrder = 2;
        this.tempVertexLine.object.visible = false;

        this.scene.add(
            this.grid,
            this.workingMesh,
            this.nearVertexPoint.object,
            this.selectedVertexPoint.object,
            this.tempVertexPoint.object,
            this.tempVertexLine.object
        );
    }

    start = () => {
        this.initEventListeners();
        this.render();
    }

    render = () => {
        this.renderer.render(this.scene, this.camera);
    }

    initEventListeners = () => {
        this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouseTracker.updateWithMouseMove(event);
            this.updateNearVertex();
        });

        this.canvas.addEventListener('click', (event: MouseEvent) => {
            if (event.shiftKey) {
                this.handleShiftClick();
            } else {
                this.handleClick();
            }
        })
    }

    updateNearVertex = () => {
        const {index, position, distanceSquared} = this.mesh.findNearestVertex(this.mouseTracker.mousePos);
        if (distanceSquared < 1) {
            if (index === this.nearVertexIndex) {
                // same near vertex, nothing to do
                return;
            }

            console.log('Near new vertex', index);

            const isSelectedVertex = position.equals(this.selectedVertexPoint.getPosition());
            this.selectedVertexPoint.material.size = isSelectedVertex ? 12 : 10;
            this.nearVertexIndex = index;
            this.nearVertexPoint.updatePosition(position);
            this.nearVertexPoint.show();
            this.render();
        } else {
            if (this.nearVertexIndex === -1) {
                return;
            }

            console.log('Not near vertex');
            this.selectedVertexPoint.material.size = 10;
            this.nearVertexPoint.hide();
            this.nearVertexIndex = -1;
            this.render();
        }
    }

    handleClick = () => {
        if (this.nearVertexIndex === -1) {
            // not near a vertex, nothing to do
            console.log('User clicked, but not near a vertex')
            return;
        }

        console.log('User clicked new vertex')
        this.selectedVertexPoint.copyPosition(this.nearVertexPoint);
        this.selectedVertexIndex = this.nearVertexIndex;
        this.selectedVertexPoint.material.size = 12;

        // reset any temp triangle creation
        this.tempVertexSelected = null;
        this.tempVertexPoint.hide();
        this.tempVertexLine.updateStart(this.selectedVertexPoint.getPosition());
        this.tempVertexLine.object.visible = false;

        this.render();
    }

    handleShiftClick = () => {
        if (_.isNull(this.tempVertexSelected)) {
            // Create/select the temporary vertex

            console.log('Creating temporary vertex');

            if (this.nearVertexIndex !== -1) {
                this.tempVertexSelected = this.nearVertexIndex;
                this.tempVertexPoint.updatePosition(this.nearVertexPoint);
            } else {
                this.tempVertexSelected = this.mouseTracker.mousePos.clone();
                this.tempVertexPoint.updatePosition(this.tempVertexSelected);
            }
        } else {
            // Already have a temporary vertex, so completing the triangle
            console.log('Finishing triangle');
            console.log('Near', this.nearVertexIndex);

            // First, create the new vertices, either creating new ones or using existing ones
            const tempVertexIndex: number = this.tempVertexSelected instanceof Vector2
                ? this.mesh.insertVertex(this.tempVertexSelected)
                : this.tempVertexSelected;

            const finalVertexIndex: number = this.nearVertexIndex === -1
                ? this.mesh.insertVertex(this.mouseTracker.mousePos)
                : this.nearVertexIndex;

            const existingTriangle = this.mesh.findTriangle(this.selectedVertexIndex, tempVertexIndex, finalVertexIndex);
            if (!_.isNull(existingTriangle)) {
                console.log('Deleting tri', this.selectedVertexIndex, tempVertexIndex, finalVertexIndex);
                this.mesh.deleteTriangle(existingTriangle);
            } else {
                console.log('New tri', this.selectedVertexIndex, tempVertexIndex, finalVertexIndex);
                this.mesh.insertTriangle(
                    this.selectedVertexIndex,
                    tempVertexIndex,
                    finalVertexIndex
                );
            }

            this.workingMesh.clear();
            this.workingMesh.add(this.mesh.toThree());

            this.tempVertexSelected = null;
            this.tempVertexPoint.hide();
            this.tempVertexLine.object.visible = false;

            this.selectedVertexIndex = finalVertexIndex;
            this.selectedVertexPoint.updatePosition(this.mesh.getVertexPosition(this.selectedVertexIndex));
        }

        this.render();
    }

    static initThree(canvas: HTMLCanvasElement): ThreeContext {
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
}

class MouseTracker {
    _canvas: HTMLCanvasElement;
    _camera: THREE.Camera;
    _grid: THREE.Object3D;

    _raycaster: THREE.Raycaster;

    mousePos: Vector2;

    constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, grid: THREE.Object3D) {
        this._canvas = canvas;
        this._camera = camera;
        this._grid = grid;

        this._raycaster = new THREE.Raycaster();
        this.mousePos = new Vector2(0, 0);
    }

    updateWithMouseMove = (event: MouseEvent) => {
        const ndcMousePos = getNDCMousePos(canvas, event.clientX, event.clientY);
        this._raycaster.setFromCamera(
            ndcMousePos, 
            this._camera
        );

        const [intersection] = this._raycaster.intersectObject(this._grid, false);
        if (intersection) {
            this.mousePos.set(intersection.point.x, intersection.point.y);
        }
    }
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

    updatePosition(position: Vector2 | FastPoint) {
        if (position instanceof FastPoint) {
            this.buffer[0] = position.buffer[0];
            this.buffer[1] = position.buffer[1];
        } else {
            this.attribute.setXY(0, position.x, position.y);
        }

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

    samePosition(that: FastPoint | Vector2) {
        let x, y;
        if (that instanceof FastPoint) {
            x = that.buffer[0];
            y = that.buffer[1];
        } else {
            x = that.x;
            y = that.y;
        }

        return this.buffer[0] === x && this.buffer[1] === y;
    }

    distanceToSquared(position: Vector2) {
        return this.getPosition().distanceToSquared(position);
    }
}

class FastLine {
    object: THREE.Line;

    constructor() {
        this.object = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([new Vector2(0, 0), new Vector2(2, 0)]),
            new THREE.LineBasicMaterial({color: 0xffff00})
        );
    }

    updateStart(pos: Vector2) {
        const attr = this._getPositionAttribute();
        attr.setXY(0, pos.x, pos.y);
        attr.needsUpdate = true;
    }

    updateEnd(pos: Vector2) {
        const attr = this._getPositionAttribute();
        attr.setXY(1, pos.x, pos.y);
        attr.needsUpdate = true;
    }

    _getPositionAttribute(): THREE.BufferAttribute {
        return this.object.geometry.getAttribute('position') as THREE.BufferAttribute;
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

function buildSquareMesh(pos: Vector2, sideL: number): TriangleMesh {
    const minX = pos.x;
    const maxX = pos.x + sideL;
    const minY = pos.y;
    const maxY = pos.y + sideL;

    const mesh = new TriangleMesh();
    mesh.insertVertex(minX, minY);
    mesh.insertVertex(maxX, minY);
    mesh.insertVertex(maxX, maxY);
    mesh.insertVertex(minX, maxY);

    mesh.insertTriangle(0, 1, 2);
    mesh.insertTriangle(0, 2, 3);

    return mesh;
}

type ThreeContext = {
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    scene: THREE.Scene,
    viewWidth: number,
    viewHeight: number
};

// initDrawMesh();
const canvas = document.getElementById('cgpp-canvas') as HTMLCanvasElement;
const prog = new DrawMesh2D(canvas);
prog.start();

