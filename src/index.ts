import * as THREE from 'three';

// const Vec3 = THREE.Vector3;
// type Vec3 = THREE.Vector3;

class Vec3 {
    vec: THREE.Vector3;

    constructor (x_or_vec: number | Vec3 | THREE.Vector3, y?: number, z?: number) {
        if (typeof x_or_vec === 'number') {
            this.vec = new THREE.Vector3(x_or_vec, y, z);
        } else if (x_or_vec instanceof Vec3) {
            this.vec = x_or_vec.vec;
        } else {
            this.vec = x_or_vec;
        }
    }

    add(that: Vec3) {
        return new Vec3(this.vec.clone().add(that.vec));
    }

    sub(that: Vec3) {
        return new Vec3(this.vec.clone().sub(that.vec));
    }

    dot(that: Vec3) : number{
        return this.vec.clone().dot(that.vec);
    }

    cross(that: Vec3) {
        return new Vec3(this.vec.clone().cross(that.vec));
    }

    divideScalar(scalar: number) {
        return new Vec3(this.vec.clone().divideScalar(scalar));
    }

    multiplyScalar(scalar: number) {
        return new Vec3(this.vec.clone().multiplyScalar(scalar));
    }
}

type Result =
    'UNSTABLE' |
    'RAY_MISSES_PLANE' |
    {result: 'OUTSIDE_TRIANGLE', alpha: number, beta: number, phi: number} |
    {result: 'INSIDE_TRIANGLE', alpha: number, beta: number, phi: number};

function vec3ToString(vec3: THREE.Vector3): string {
    return `[ ${vec3.x} ${vec3.y} ${vec3.z} ]`;
}

function rayTriangleIntersection(
    A: Vec3,
    B: Vec3,
    C: Vec3,

    P: Vec3,
    d: Vec3
): Result {
    const n = (B.sub(A).cross(C.sub(A))); // normal to the triangle (not unit)

    const A_to_B = B.sub(A);

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
    const phi = (Q.sub(C)).dot(AC_T);
    const beta = (Q.sub(B)).dot(AB_T);
    const alpha = 1 - (phi + beta);

    const inside = (coord: number) => 0 <= coord && coord <= 1;

    return (inside(alpha) && inside(beta) && inside(phi))
        ? {result: 'INSIDE_TRIANGLE', alpha, beta, phi}
        : {result: 'OUTSIDE_TRIANGLE', alpha, beta, phi};
}

const A = new Vec3(0, 0, 0);
const B = new Vec3(1, 0, 0);
const C = new Vec3(0, 0, 1);

const P = new Vec3(0, 1, 0);

const d = new Vec3(0, -1, 0);

console.log(`Result: ${JSON.stringify(rayTriangleIntersection(
    A, B, C, P, d
))}`);

