import Segment from "./math/Segment";
import { Vec2 } from "./math/Vec2";

export type IntTriple = {x: number, y: number, w: number};

export function intTripleToPoint(triple: boolean | IntTriple): Vec2 {
    if (typeof triple !== 'object') {
        throw new Error('illegal arg');
    }

    const {x, y, w} = triple;
    return new Vec2(x/w, y/w);
}

export default function checkSegmentsIntersect(seg1: Segment, seg2: Segment): boolean | {x: number, y: number, w: number} {
    const P = seg1.start;
    const Q = seg1.end;

    const R = seg2.start;
    const S = seg2.end;

    const v = Q.sub(R);
    const u = P.sub(Q);

    const n = new Vec2(
        S.y - R.y,
        R.x - S.x
    );

    const u_dot_n = u.dot(n);
    if (u_dot_n == 0) {
        // parallel, so handle specially

        // first, we check if line PQ is on line RS, using implicit form of RS line {(X - R) `dot` n == 0} and P
        const p_on_rs = P.sub(R).dot(n) == 0;
        if (!p_on_rs) {
            // lines are not incidental
            return false;
        }

        const minPQ = Vec2.minXY(P, Q);
        const maxPQ = Vec2.maxXY(P, Q);

        const minRS = Vec2.minXY(R, S);
        const maxRS = Vec2.maxXY(R, S);

        if (maxPQ <= minRS || maxRS <= minPQ) {
            // PQ is 'before, after, or touching' RS 
            return false;
        } else {
            return minRS < maxPQ || minPQ < maxRS;
        }
    }

    let t_n = -v.dot(n);
    let t_d = u_dot_n;

    if (t_n === 0 || ((t_n >= 0) != (t_d >= 0))) {
        // t is zero or negative, so no intersection
        return false;
    } else if (Math.abs(t_n) > Math.abs(t_d)) {
        // t is greater than one, so no intersection
        return false;
    } else if (t_n < 0 && t_d < 0) {
        // both negative, so make them positive for aesthetics
        t_n = Math.abs(t_n);
        t_d = Math.abs(t_d);
    }

    // otherwise, find out where along P and Q it is and whether it's inside
    // const I = P.multiplyScalar(t).add(Q.multiplyScalar(1 - t));
    const I_prime = P.sub(Q).multiplyScalar(t_n).add(Q.multiplyScalar(t_d));

    return withinNonInclusive(I_prime.x, seg2.start.x * t_d, seg2.end.x * t_d) 
        ? {x: I_prime.x, y: I_prime.y, w: t_d} 
        : false;
}

function withinNonInclusive(x: number, a: number, b: number): boolean {
    return Math.min(a, b) < x && x < Math.max(a, b);
}