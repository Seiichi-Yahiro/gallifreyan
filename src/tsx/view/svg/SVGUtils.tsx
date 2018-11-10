/**
 * Get svg path of a partial circle
 * 0 Radians is on the right
 * Drawn clockwise
 *
 * @param {number} cx - circle x position
 * @param {number} cy - circle y position
 * @param {number} r - circle radius
 * @param {number} start - start angle in radians
 * @param {number} end - end angle in radians
 * @returns {string} svg path
 */
export const partialCircle = (
    cx: number,
    cy: number,
    r: number,
    start: number,
    end: number
): string => {
    const length = end - start;

    if (length === 0) {
        return '';
    }

    const fromX = r * Math.cos(start) + cx;
    const fromY = r * Math.sin(start) + cy;
    const toX = r * Math.cos(end) + cx;
    const toY = r * Math.sin(end) + cy;
    const large = Math.abs(length) <= Math.PI ? '0' : '1';
    const sweep = length < 0 ? '0' : '1';

    return `M ${fromX} ${fromY} A ${r} ${r} 0 ${large} ${sweep} ${toX} ${toY}`;
};

export class Point {
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

/**
 * Calculate the points where a circle "a" in the center of the system intersects with a circle "b"
 *
 * @param ra - radius of circle a
 * @param rb - radius of circle b
 * @param posB - the position of circle b
 */
export const calculateCircleIntersectionPoints = (
    ra: number,
    rb: number,
    posB: Point
): Point[] => {
    const distance = posB.length();
    if (distance === 0) {
        return [];
    }

    const { pow } = Math;
    const raSq = pow(ra, 2);
    const x = (raSq + pow(distance, 2) - pow(rb, 2)) / (2.0 * distance);

    const determinant = raSq - pow(x, 2);
    if (determinant <= 0) {
        return [];
    }

    const y = Math.sqrt(determinant);

    const xUnitVector = posB.unit();
    const yUnitVector = xUnitVector.rotate(Math.PI / 2.0);
    const xMoveVector = xUnitVector.multiply(x);
    const yMoveVector = yUnitVector.multiply(y);

    const q1 = xMoveVector.add(yMoveVector);
    const q2 = xMoveVector.subtract(yMoveVector);

    return [q1, q2];
};

export const calculateCircleIntersectionAngle = (
    point: Point,
    r: number
): number => {
    const zeroAngleVector = new Point(r, 0);

    let angle = Math.acos(
        point.dot(zeroAngleVector) / (point.length() * zeroAngleVector.length())
    );

    if (point.cross(zeroAngleVector) > 0) {
        angle = Math.PI * 2 - angle;
    }

    return angle;
};
