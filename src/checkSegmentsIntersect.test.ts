import checkSegmentsIntersect from "./checkSegmentsIntersect";
import Segment from "./math/Segment"
import { Vec2 } from "./math/Vec2"

describe('checkSegmentsIntersect', () => {
    it('positive for simple intersection', () => {
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

    it('positive for simple intersection flipped', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        ).flipped();

        const hSeg = new Segment(
            new Vec2(-2, 0),
            new Vec2(2, 0)
        ).flipped();

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBeTruthy();
    })

    it('negative for simple non-intersection', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        );

        const hSeg = new Segment(
            new Vec2(2, 4),
            new Vec2(4, 4)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBeFalsy();
    })

    it('negative for perp non-intersection', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        );

        const hSeg = new Segment(
            new Vec2(2, 0),
            new Vec2(4, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBeFalsy();
    })
})