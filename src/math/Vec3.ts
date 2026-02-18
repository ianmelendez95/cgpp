import * as THREE from 'three';

export class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor(x_or_vec: number | Vec3 | THREE.Vector3, y?: number, z?: number) {
        if (typeof x_or_vec === 'number') {
            this.x = x_or_vec;
            this.y = y!;
            this.z = z!;
        } else {
            this.x = x_or_vec.x;
            this.y = x_or_vec.y;
            this.z = x_or_vec.z;
        }
    }

    static fromThree(threeVec: THREE.Vector3): Vec3 {
        return new Vec3(threeVec);
    }

    withY(y: number) {
        return new Vec3(this.x, y, this.z);
    }

    toThree(): THREE.Vector3 {
        return new THREE.Vector3(this.x, this.y, this.z);
    }

    add(that: Vec3) {
        return Vec3.fromThree(this.toThree().add(that.toThree()));
    }

    sub(that: Vec3) {
        return Vec3.fromThree(this.toThree().sub(that.toThree()));
    }

    dot(that: Vec3): number {
        return this.toThree().dot(that.toThree());
    }

    cross(that: Vec3) {
        return Vec3.fromThree(this.toThree().cross(that.toThree()));
    }

    divideScalar(scalar: number) {
        return Vec3.fromThree(this.toThree().divideScalar(scalar));
    }

    multiplyScalar(scalar: number) {
        return Vec3.fromThree(this.toThree().multiplyScalar(scalar));
    }

    toString() {
        return `[ ${this.x} ${this.y} ${this.z} ]`;
    }
}
export function vec3ToString(vec3: THREE.Vector3): string {
    return `[ ${vec3.x} ${vec3.y} ${vec3.z} ]`;
}

