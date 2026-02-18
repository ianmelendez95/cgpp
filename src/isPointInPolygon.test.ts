import isPointInPolygon from './isPointInPolygon';
import { Vec2 } from './math/Vec2';

const v = (x: number, y: number) => new Vec2(x, y);

describe('isPointInPolygon', () => {
	it('returns true for a point inside a triangle', () => {
		const tri = [v(0, 0), v(2, 0), v(0, 2)];
		expect(isPointInPolygon(v(0.5, 0.5), tri)).toBe(true);
	});

	it('returns false for a point outside a triangle', () => {
		const tri = [v(0, 0), v(2, 0), v(0, 2)];
		expect(isPointInPolygon(v(2, 2), tri)).toBe(false);
	});

	it('returns true for a point inside a square', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(1, 1), square)).toBe(true);
	});

	it('returns false for a point outside a square', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(-0.1, 1), square)).toBe(false);
	});
});

