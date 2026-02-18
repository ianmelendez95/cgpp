import * as THREE from 'three';

export class Vec2 {
    x: number;
    y: number;

    constructor(x_or_vec: number | Vec2 | THREE.Vector2, y?: number, z?: number) {
        if (typeof x_or_vec === 'number') {
            this.x = x_or_vec;
            this.y = y!;
        } else {
            this.x = x_or_vec.x;
            this.y = x_or_vec.y;
        }
    }

    static fromThree(threeVec: THREE.Vector2): Vec2 {
        return new Vec2(threeVec);
    }

    withY(y: number) {
        return new Vec2(this.x, y);
    }

    toThree(): THREE.Vector2 {
        return new THREE.Vector2(this.x, this.y);
    }

    add(that: Vec2) {
        return Vec2.fromThree(this.toThree().add(that.toThree()));
    }

    sub(that: Vec2) {
        return Vec2.fromThree(this.toThree().sub(that.toThree()));
    }

    dot(that: Vec2): number {
        return this.toThree().dot(that.toThree());
    }

    cross() {
        return new Vec2(-this.y, this.x);
    }

    divideScalar(scalar: number) {
        return Vec2.fromThree(this.toThree().divideScalar(scalar));
    }

    multiplyScalar(scalar: number) {
        return Vec2.fromThree(this.toThree().multiplyScalar(scalar));
    }

    toString() {
        return `[ ${this.x} ${this.y} ]`;
    }
}
