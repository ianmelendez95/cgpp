import * as THREE from 'three';
import {Vector2, Vector3} from 'three';

export function newGridObjs(
    minXY: number, 
    maxXY: number, 
    spacing: number,
): THREE.Object3D[] {
    let dotsObj; {
        const gridPoints = [];
        for (let i = minXY; i <= maxXY; i++) {
            for (let j = minXY; j <= maxXY; j++) {
                gridPoints.push(new Vector2(i ,j).multiplyScalar(spacing));
            }
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
        const material = new THREE.PointsMaterial({color: 0x505050, opacity: 0.1})

        dotsObj = new THREE.Points(geometry, material);
    }

    let crossObj; {
        const crossRad = spacing * 0.5;

        const geometry = new THREE.BufferGeometry().setFromPoints([
            new Vector2(-crossRad, 0), new Vector2(crossRad, 0),
            new Vector2(0, -crossRad), new Vector2(0, crossRad)
        ]);
        const material = new THREE.LineBasicMaterial({color: 0x707070});
        crossObj = new THREE.LineSegments(geometry, material);
    }

    return [dotsObj, crossObj];
}

export function newSegmentsObj(points: Vector3[] | Vector2[]): THREE.Object3D {
    const material = new THREE.LineBasicMaterial({color: 0xffffff});

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);

    return line;
}

export function newPointsObj(
    points: Vector3[] | Vector2[], 
    {
        color,
        opacity
    }: {
        color?: number,
        opacity?: number
    } = {
        color: 0xf0f0f0,
        opacity: 1.0
    }
): THREE.Object3D {
    const material = new THREE.PointsMaterial({color});
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsObj = new THREE.Points(geometry, material);

    return pointsObj;
}
