import {Vec3} from './math.js';
import * as THREE from 'three';

export class Triangle {
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

export type Ray = {
    P: Vec3,
    d: Vec3
};


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

export function rayTriangleIntersection(
    {a: A, b: B, c: C}: Triangle,
    {P, d}: Ray
): Result {
    const n = (B.sub(A)).cross(C.sub(A));

    if (Math.abs(d.dot(n)) < Number.EPSILON) {
        // would be near zero division later
        return {result: 'UNSTABLE'};
    }

    const t = (A.sub(P).dot(n)) / d.dot(n);

    if (t < 0) {
        return {result: 'RAY_MISSES_PLANE'};
    }

    const Q = P.add(d.multiplyScalar(t));

    let AB_T = n.cross(B.sub(A));
    AB_T = AB_T.divideScalar(C.sub(A).dot(AB_T));

    let AC_T = C.sub(A).cross(n);
    AC_T = AC_T.divideScalar(B.sub(A).dot(AC_T));

    const phi = Q.sub(A).dot(AB_T);
    const beta = Q.sub(A).dot(AC_T);
    const alpha = 1 - (phi + beta);

    return {
        result: Math.min(alpha, phi, beta) < 0 || Math.max(alpha, phi, beta) > 1 ? 'OUTSIDE_TRIANGLE' : 'INSIDE_TRIANGLE',
        alpha,
        beta,
        phi
    }
}

export type Result = ErrorResult | IntersectionResult;

export type ErrorResult = {
    result: 'UNSTABLE' | 'RAY_MISSES_PLANE'
}

export type IntersectionResult = {
    result: 'OUTSIDE_TRIANGLE' | 'INSIDE_TRIANGLE',
    alpha: number,
    beta: number,
    phi: number
}
