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

    return 0 <= t && t <= 1;
}