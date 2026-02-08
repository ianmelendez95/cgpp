import { Vec2 } from './math';

export default function isPointInPolygon(point: Vec2, polygon: Vec2[]): boolean {
    if (polygon.length < 2) {
        throw new Error("Polygon must have at least three vertices");
    }

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