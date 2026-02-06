import * as THREE from 'three';
import {tri} from "three/src/nodes/math/TriNoise3D";

// const Vec3 = THREE.Vector3;
// type Vec3 = THREE.Vector3;

class Vec3 {
    x: number;
    y: number;
    z: number;

    constructor (x_or_vec: number | Vec3 | THREE.Vector3, y?: number, z?: number) {
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

    dot(that: Vec3) : number{
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
        return `[ ${this.x} ${this.y} ${this.z} ]`
    }
}

class Triangle {
    a: Vec3;
    b: Vec3;
    c: Vec3;

    constructor (a: Vec3, b: Vec3, c: Vec3) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static fromThree(triangle: THREE.Triangle): Triangle {
        return new Triangle(Vec3.fromThree(triangle.a), Vec3.fromThree(triangle.b), Vec3.fromThree(triangle.c));
    }

    toThree(): THREE.Triangle {
        return new THREE.Triangle(this.a.toThree(), this.b.toThree(), this.c.toThree());
    }

    centroid(): Vec3 {
        const vec = new THREE.Vector3();
        this.toThree().getMidpoint(vec);
        return Vec3.fromThree(vec);
    }

}

type Ray = {
    P: Vec3,
    d: Vec3
};

type Result =
    'UNSTABLE' |
    'RAY_MISSES_PLANE' |
    {result: 'OUTSIDE_TRIANGLE', alpha: number, beta: number, phi: number} |
    {result: 'INSIDE_TRIANGLE', alpha: number, beta: number, phi: number};

function vec3ToString(vec3: THREE.Vector3): string {
    return `[ ${vec3.x} ${vec3.y} ${vec3.z} ]`;
}

function rayTriangleIntersection(
    {a: A, b: B, c: C}: Triangle,
    {P, d}: Ray
): Result {
    const n = (B.sub(A).cross(C.sub(A))); // normal to the triangle (not unit)

    let AB_T = n.cross(B.sub(A));
    AB_T = AB_T.divideScalar(C.sub(A).dot(AB_T));

    let AC_T = n.cross(A.sub(C));
    AC_T = AC_T.divideScalar(B.sub(A).dot(AC_T));

    const u = n.dot(d);
    if (Math.abs(u) < Number.EPSILON) {
        return 'UNSTABLE';
    }

    const t = ((A.sub(P)).dot(n)) / u;
    if (t < 0) {
        return 'RAY_MISSES_PLANE';
    }

    const Q = P.add(d.multiplyScalar(t));
    const beta = (Q.sub(A)).dot(AC_T);
    const phi = (Q.sub(A)).dot(AB_T);
    const alpha = 1 - (phi + beta);

    const inside = (coord: number) => 0 <= coord && coord <= 1;

    return (inside(alpha) && inside(beta) && inside(phi))
        ? {result: 'INSIDE_TRIANGLE', alpha, beta, phi}
        : {result: 'OUTSIDE_TRIANGLE', alpha, beta, phi};
}

// Ray above A pointing down

const triangle: Triangle = new Triangle(
    new Vec3(0, 0, 0),
    new Vec3(1, 0, 0),
    new Vec3(0, 0, 1)
);

const down = new Vec3(0, -1, 0);

const ray_down_to_A = {
    P: new Vec3(0, 1, 0), // above A
    d: down
}

const ray_down_to_B = {
    P: new Vec3(1, 1, 0), // above B
    d: down
}

const ray_down_to_C = {
    P: new Vec3(0, 1, 1), // above C
    d: down
}

const ray_down_to_mid_AB = {
    P: new Vec3(0.5, 1, 0), // above midpoint of A and B
    d: down
}

const ray_down_to_centroid = {
    P: triangle.centroid().withY(1),
    d: down
}

console.log(`Result: ${JSON.stringify(rayTriangleIntersection(
    triangle, 
    ray_down_to_centroid
))}`);

