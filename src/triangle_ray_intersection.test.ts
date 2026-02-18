import { Vec3 } from './math/Vec3';
import { rayTriangleIntersection, Triangle } from './trangle_ray_intersection';

describe('rayTriangleIntersection', () => {
  it('returns INSIDE_TRIANGLE for a clear hit', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, 1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 0.5);
      expectClose(res.beta, 0.25);
      expectClose(res.phi, 0.25);
    }
  });

  it('returns OUTSIDE_TRIANGLE when intersection point lies outside the triangle', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(1.1, 1.1, 1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res.result).toBe('OUTSIDE_TRIANGLE');
  });

  it('returns RAY_MISSES_PLANE when the intersection is behind the ray origin (t < 0)', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, -1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res.result).toBe('RAY_MISSES_PLANE');
  });

  it('returns UNSTABLE when ray direction is parallel to the triangle plane (u ≈ 0)', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, 1), d: new Vec3(1, 0, 0) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res.result).toBe('UNSTABLE');
  });

  const exampleTriangle: Triangle = new Triangle(
    new Vec3(0, 0, 0),
    new Vec3(1, 0, 0),
    new Vec3(0, 0, 1)
  );

  const down = new Vec3(0, -1, 0);

  function expectInsideTriangle(rayName: string, ray: { P: Vec3; d: Vec3 }) {
    const res = rayTriangleIntersection(exampleTriangle, ray);
    expect(typeof res, `${rayName} should return barycentric result`).toBe('object');
    if (typeof res === 'object') {
      expect(res.result, `${rayName} should be inside triangle`).toBe('INSIDE_TRIANGLE');
    }
  }

  it('ray_down_to_A is inside the triangle', () => {
    const ray_down_to_A = { P: new Vec3(0, 1, 0), d: down };
    const res = rayTriangleIntersection(exampleTriangle, ray_down_to_A);
    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 1);
      expectClose(res.beta, 0);
      expectClose(res.phi, 0);
    }
  });

  it('ray_down_to_B is inside the triangle', () => {
    const ray_down_to_B = { P: new Vec3(1, 1, 0), d: down };
    const res = rayTriangleIntersection(exampleTriangle, ray_down_to_B);
    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 0);
      expectClose(res.beta, 1);
      expectClose(res.phi, 0);
    }
  });

  it('ray_down_to_C is inside the triangle', () => {
    const ray_down_to_C = { P: new Vec3(0, 1, 1), d: down };
    const res = rayTriangleIntersection(exampleTriangle, ray_down_to_C);
    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 0);
      expectClose(res.beta, 0);
      expectClose(res.phi, 1);
    }
  });

  it('ray_down_to_mid_AB is inside the triangle', () => {
    const ray_down_to_mid_AB = { P: new Vec3(0.5, 1, 0), d: down };
    const res = rayTriangleIntersection(exampleTriangle, ray_down_to_mid_AB);
    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 0.5);
      expectClose(res.beta, 0.5);
      expectClose(res.phi, 0);
    }
  });

  it('ray_down_to_centroid is inside the triangle', () => {
    const ray_down_to_centroid = { P: exampleTriangle.centroid().withY(1), d: down };
    const res = rayTriangleIntersection(exampleTriangle, ray_down_to_centroid);
    expect(res.result).toBe('INSIDE_TRIANGLE');
    if (res.result === 'INSIDE_TRIANGLE') {
      expectClose(res.alpha, 0.3333);
      expectClose(res.beta, 0.3333);
      expectClose(res.phi, 0.3333);
    }
  });
});

function expectClose(actual: number, expected: number, epsilon = 1e-9) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(0.01);
}
