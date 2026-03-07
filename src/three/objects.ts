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
        const material = new THREE.PointsMaterial({color: 0x505050, size: 2, sizeAttenuation: false})

        dotsObj = new THREE.Points(geometry, material);
    }

    let ticks; {
        const tickWidths = spacing * 0.2;
        let tickSegments = [];
        for (let xyPos = 0; xyPos < maxXY; xyPos += 5) {
            tickSegments.push(
                // +y
                new Vector2(-tickWidths, xyPos),
                new Vector2(tickWidths, xyPos),

                // -y
                new Vector2(-tickWidths, -xyPos),
                new Vector2(tickWidths, -xyPos),

                // x
                new Vector2(xyPos, -tickWidths),
                new Vector2(xyPos, tickWidths),

                // x
                new Vector2(-xyPos, -tickWidths),
                new Vector2(-xyPos, tickWidths)
            );
        }

        const ticksGeometry = new THREE.BufferGeometry().setFromPoints(tickSegments);
        const ticksMaterial = new THREE.LineBasicMaterial({color: 0x707070});
        ticks = new THREE.LineSegments(ticksGeometry, ticksMaterial);
    }

    return [dotsObj, ticks];
}

export function newSegmentsObj(points: Vector3[] | Vector2[], {dashed = false}: {dashed?: boolean} = {}): THREE.Object3D {
    const material = dashed 
        ? new THREE.LineDashedMaterial({color: 0x505050, scale: 1, gapSize: 0.1, dashSize: 0.5})
        : new THREE.LineBasicMaterial({color: 0xffffff});

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometry, material);
    line.computeLineDistances();

    return line;
}

export function newPointsObj(
    points: Vector3[] | Vector2[], 
    {
        color
    }: {
        color?: number,
    } = {
        color: 0xf0f0f0,
    }
): THREE.Object3D {
    const material = new THREE.PointsMaterial({color, size: 10, sizeAttenuation: false});
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsObj = new THREE.Points(geometry, material);

    return pointsObj;
}
