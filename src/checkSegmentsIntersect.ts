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

    const t = (-v.dot(n)) / (u.dot(n)) 

    if (t < 0 || 1 < t) {
        // does not land within seg1, so we immediately know it's not an intersection
        return false;
    }

    // otherwise, find out where along P and Q it is and whether it's inside
    const I = P.multiplyScalar(t).add(Q.multiplyScalar(1 - t));

    return Math.min(seg2.start.x, seg2.end.x) < I.x && I.x < Math.max(seg2.start.x, seg2.end.x);
}