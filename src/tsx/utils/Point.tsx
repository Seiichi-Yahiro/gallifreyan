class Point {
    constructor(public x: number, public y: number) {}

    public rotate = (angle: number): Point => {
        const { x, y } = this;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        const rotatedX = x * cosAngle - y * sinAngle;
        const rotatedY = x * sinAngle + y * cosAngle;

        return new Point(rotatedX, rotatedY);
    };

    public length = (): number => {
        const { x, y } = this;
        return Math.sqrt(x * x + y * y);
    };

    public unit = (): Point => {
        const length = this.length();
        const { x, y } = this;
        return new Point(x / length, y / length);
    };

    public multiply = (num: number): Point => {
        const { x, y } = this;
        return new Point(x * num, y * num);
    };

    public add = (point: Point): Point => {
        const { x, y } = this;
        const { x: px, y: py } = point;

        return new Point(x + px, y + py);
    };

    public subtract = (point: Point): Point => {
        const { x, y } = this;
        const { x: px, y: py } = point;

        return new Point(x - px, y - py);
    };

    public dot = (point: Point): number => {
        const { x, y } = this;
        const { x: px, y: py } = point;

        return x * px + y * py;
    };

    public cross = (point: Point): number => {
        const { x, y } = this;
        const { x: px, y: py } = point;

        return x * py - px * y;
    };
}

export default Point;
