import { Vec2 } from "./Vec2";

export default class Segment {
    start: Vec2;
    end: Vec2;

    constructor(start: Vec2, end: Vec2) {
        this.start = start;
        this.end = end;
    }
}