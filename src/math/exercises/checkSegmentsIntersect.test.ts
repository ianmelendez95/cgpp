import checkSegmentsIntersect, { intTripleToPoint } from "./checkSegmentsIntersect";
import Segment from "../Segment"
import { Vec2 } from "../Vec2"

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

        expect(intTripleToPoint(checkSegmentsIntersect(vSeg, hSeg))).toEqual(new Vec2(0, 0));
    })

    it('negative for simple intersection on end', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        );

        const hSeg = new Segment(
            new Vec2(-2, 0),
            new Vec2(0, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBe(false);
    })

    it('negative for simple intersection on end 2', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 0)
        );

        const hSeg = new Segment(
            new Vec2(-2, 0),
            new Vec2(2, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBe(false);
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

        expect(intTripleToPoint(checkSegmentsIntersect(vSeg, hSeg))).toEqual(new Vec2(0, 0));
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

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBe(false);
    })

    it('negative for perp non-intersection 1', () => {
        const vSeg = new Segment(
            new Vec2(0, -2),
            new Vec2(0, 2)
        );

        const hSeg = new Segment(
            new Vec2(2, 0),
            new Vec2(4, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBe(false);
    })

    it('negative for perp non-intersection 1', () => {
        const vSeg = new Segment(
            new Vec2(0, -4),
            new Vec2(0, -2)
        );

        const hSeg = new Segment(
            new Vec2(-2, 0),
            new Vec2(2, 0)
        );

        expect(checkSegmentsIntersect(vSeg, hSeg)).toBe(false);
    })

    it('negative for disjoint parallel', () => {
        const lSeg = new Segment(
            new Vec2(0, 0),
            new Vec2(0, 2)
        );

        const rSeg = new Segment(
            new Vec2(2, 0),
            new Vec2(2, 2)
        );

        expect(checkSegmentsIntersect(lSeg, rSeg)).toBe(false);
    })

    it('negative for touching parallel', () => {
        const lSeg = new Segment(
            new Vec2(0, 0),
            new Vec2(0, 2)
        );

        const rSeg = new Segment(
            new Vec2(0, 2),
            new Vec2(0, 4)
        );

        expect(checkSegmentsIntersect(lSeg, rSeg)).toBe(false);
    })

    it('positive for overlap parallel', () => {
        const lSeg = new Segment(
            new Vec2(0, 0),
            new Vec2(0, 2)
        );

        const rSeg = new Segment(
            new Vec2(0, 1),
            new Vec2(0, 3)
        );

        expect(checkSegmentsIntersect(lSeg, rSeg)).toBe(true);
    })
})