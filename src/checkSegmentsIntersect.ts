import Segment from "./math/Segment";
import { Vec2 } from "./math/Vec2";

export default function checkSegmentsIntersect(seg1: Segment, seg2: Segment): boolean {
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

    const t = (-v.dot(n)) / u_dot_n 

    if (!withinNonInclusive(t, 0, 1)) {
        // does not land within seg1, so we immediately know it's not an intersection
        return false;
    }

    // otherwise, find out where along P and Q it is and whether it's inside
    const I = P.multiplyScalar(t).add(Q.multiplyScalar(1 - t));

    return withinNonInclusive(I.x, seg2.start.x, seg2.end.x);
}

function withinNonInclusive(x: number, a: number, b: number): boolean {
    return Math.min(a, b) < x && x < Math.max(a, b);
}