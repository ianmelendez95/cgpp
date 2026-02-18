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

    static minXY(vec1: Vec2, vec2: Vec2) {
        return vec1.compareXY(vec2) >= 0 ? vec1 : vec2;
    }

    static maxXY(vec1: Vec2, vec2: Vec2) {
        return vec1.compareXY(vec2) <= 0 ? vec1 : vec2;
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

    compareXY(that: Vec2): number {
        if (this.x < that.x) {
            return 1;
        } else if (this.x > that.x) {
            return -1;
        } else if (this.y < that.y) {
            return 1;
        } else if (this.y > that.y) {
            return -1;
        } else {
            return 0;
        }
    }

    isEqual(that: Vec2) {
        return this.x === that.x && this.y === that.y;
    }

    toString() {
        return `[ ${this.x} ${this.y} ]`;
    }
}
