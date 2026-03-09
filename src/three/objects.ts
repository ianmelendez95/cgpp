import * as THREE from 'three';
import {Vector2, Vector3} from 'three';

export type Grid = {
    backboard: THREE.Object3D,
    content: THREE.Object3D
}

export function buildGrid(
    width: number,
    height: number,
): Grid {
    let backboard = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({color: 0x2e2e2e, side: THREE.DoubleSide})
    );

    const maxXY = Math.ceil(Math.max(width, height) / 2);

    let dotsObj; {
        const gridPoints = [];
        for (let i = -maxXY; i <= maxXY; i++) {
            for (let j = -maxXY; j <= maxXY; j++) {
                gridPoints.push(new Vector2(i ,j));
            }
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
        const material = new THREE.PointsMaterial({color: 0x505050, size: 2, sizeAttenuation: false})

        dotsObj = new THREE.Points(geometry, material);
    }

    let ticks; {
        const tickHalfWidth = 0.2;
        let tickSegments = [];
        for (let xyPos = 0; xyPos < maxXY; xyPos += 5) {
            tickSegments.push(
                // +y
                new Vector2(-tickHalfWidth, xyPos),
                new Vector2(tickHalfWidth, xyPos),

                // -y
                new Vector2(-tickHalfWidth, -xyPos),
                new Vector2(tickHalfWidth, -xyPos),

                // x
                new Vector2(xyPos, -tickHalfWidth),
                new Vector2(xyPos, tickHalfWidth),

                // x
                new Vector2(-xyPos, -tickHalfWidth),
                new Vector2(-xyPos, tickHalfWidth)
            );
        }

        const ticksGeometry = new THREE.BufferGeometry().setFromPoints(tickSegments);
        const ticksMaterial = new THREE.LineBasicMaterial({color: 0x707070});
        ticks = new THREE.LineSegments(ticksGeometry, ticksMaterial);
    }

    const content = new THREE.Object3D();

    backboard.add(dotsObj);
    backboard.add(ticks);
    backboard.add(content);

    return {backboard, content};
}

export function buildSegments(points: Vector3[] | Vector2[], {dashed = false}: {dashed?: boolean} = {}): THREE.LineSegments {
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
