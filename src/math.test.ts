import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { rayTriangleIntersection, Triangle, Vec3, vec3ToString } from './math';

function expectClose(actual: number, expected: number, epsilon = 1e-9) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(epsilon);
}

describe('vec3ToString', () => {
  it('formats a THREE.Vector3 as [ x y z ]', () => {
    const v = new THREE.Vector3(1, 2, 3);
    expect(vec3ToString(v)).toBe('[ 1 2 3 ]');
  });
});

describe('rayTriangleIntersection', () => {
  it('returns INSIDE_TRIANGLE for a clear hit', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, 1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(typeof res).toBe('object');
    if (typeof res === 'object') {
      expect(res.result).toBe('INSIDE_TRIANGLE');
      expectClose(res.alpha, 0.5);
      expectClose(res.beta, 0.25);
      expectClose(res.phi, 0.25);
    }
  });

  it('returns OUTSIDE_TRIANGLE when intersection point lies outside the triangle', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(1.1, 1.1, 1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(typeof res).toBe('object');
    if (typeof res === 'object') {
      expect(res.result).toBe('OUTSIDE_TRIANGLE');
    }
  });

  it('returns RAY_MISSES_PLANE when the intersection is behind the ray origin (t < 0)', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, -1), d: new Vec3(0, 0, -1) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res).toBe('RAY_MISSES_PLANE');
  });

  it('returns UNSTABLE when ray direction is parallel to the triangle plane (u ≈ 0)', () => {
    const tri = new Triangle(new Vec3(0, 0, 0), new Vec3(1, 0, 0), new Vec3(0, 1, 0));
    const ray = { P: new Vec3(0.25, 0.25, 1), d: new Vec3(1, 0, 0) };

    const res = rayTriangleIntersection(tri, ray);

    expect(res).toBe('UNSTABLE');
  });
});
