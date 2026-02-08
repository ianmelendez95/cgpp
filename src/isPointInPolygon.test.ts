import isPointInPolygon from './isPointInPolygon';
import { Vec3 } from './math';

const v = (x: number, z: number) => new Vec3(x, 0, z);

describe('isPointInPolygon', () => {
	it('returns true for a point inside a triangle', () => {
		const tri = [v(0, 0), v(2, 0), v(0, 2)];
		expect(isPointInPolygon(v(0.5, 0.5), tri)).toBe(true);
	});

	it.todo('returns false for a point outside a triangle', () => {
		const tri = [v(0, 0), v(2, 0), v(0, 2)];
		expect(isPointInPolygon(v(2, 2), tri)).toBe(false);
	});

	it.todo('returns true for a point inside a square', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(1, 1), square)).toBe(true);
	});

	it.todo('returns false for a point outside a square', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(-0.1, 1), square)).toBe(false);
	});

	it.todo('treats points on an edge as inside', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(1, 0), square)).toBe(true);
	});

	it.todo('treats points on a vertex as inside', () => {
		const square = [v(0, 0), v(2, 0), v(2, 2), v(0, 2)];
		expect(isPointInPolygon(v(0, 0), square)).toBe(true);
	});

	it.todo('works for a concave polygon', () => {
		// Simple concave "arrow" shape
		const concave = [v(0, 0), v(3, 0), v(3, 1), v(1.5, 0.5), v(3, 2), v(3, 3), v(0, 3)];
		expect(isPointInPolygon(v(0.5, 1.5), concave)).toBe(true);
		expect(isPointInPolygon(v(2.5, 1.5), concave)).toBe(false);
	});
});