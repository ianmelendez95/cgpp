import {Triangle, Vec3, rayTriangleIntersection} from './math.js';

// Ray above A pointing down

const triangle: Triangle = new Triangle(
    new Vec3(0, 0, 0),
    new Vec3(1, 0, 0),
    new Vec3(0, 0, 1)
);

const down = new Vec3(0, -1, 0);

const ray_down_to_A = {
    P: new Vec3(0, 1, 0), // above A
    d: down
}

const ray_down_to_B = {
    P: new Vec3(1, 1, 0), // above B
    d: down
}

const ray_down_to_C = {
    P: new Vec3(0, 1, 1), // above C
    d: down
}

const ray_down_to_mid_AB = {
    P: new Vec3(0.5, 1, 0), // above midpoint of A and B
    d: down
}

const ray_down_to_centroid = {
    P: triangle.centroid().withY(1),
    d: down
}

console.log(`Result: ${JSON.stringify(rayTriangleIntersection(
    triangle, 
    ray_down_to_centroid
))}`);
