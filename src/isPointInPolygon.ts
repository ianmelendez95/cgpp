import { Vec2 } from './math';
import _ from 'lodash';

export default function isPointInPolygon(point: Vec2, polygon: Vec2[]): boolean {
    return arePointsInPolygon([point], polygon);
}

export function arePointsInPolygon(points: Vec2[], polygon: Vec2[]): boolean {
    if (polygon.length < 2) {
        throw new Error("Polygon must have at least three vertices");
    }

    const point = points[0];

    const edgeVectors = [];
    for (let vertexI = 0; vertexI < polygon.length; vertexI++) {
        const curVertexI = vertexI;
        const nextVertexI = (vertexI + 1) % polygon.length; // modulo for 'wrap around' logic

        const curVertex = polygon[curVertexI];

        const edgeVector = polygon[nextVertexI].sub(curVertex);
        const innerNormal = edgeVector.cross();

        const pointToVertex = curVertex.sub(point);
        const dotResult = pointToVertex.dot(innerNormal);

        if (dotResult > 0) {
            return false;
        }
    }

    return true;
}

function pointsCrossY(y: number, p1: Vec2, p2: Vec2) {
    return ((p1.y - y) * (p2.y - y)) < 0;
}