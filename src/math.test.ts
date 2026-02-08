import * as THREE from 'three';
import { vec3ToString } from './math';

describe('vec3ToString', () => {
  it('formats a THREE.Vector3 as [ x y z ]', () => {
    const v = new THREE.Vector3(1, 2, 3);
    expect(vec3ToString(v)).toBe('[ 1 2 3 ]');
  });
});

