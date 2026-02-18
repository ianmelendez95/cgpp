import checkSegmentsIntersect from "./checkSegmentsIntersect";
import Segment from "./math/Segment"
import { Vec2 } from "./math/Vec2"

describe('checkSegmentsIntersect', () => {
    it('positive for intersection at origin', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        );

        const hSeg = new Segment(
            new Vec2(-2, 0),
            new Vec2(2, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBeTruthy();
    })
})