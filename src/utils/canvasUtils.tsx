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
export const partialCircle = (cx: number, cy: number, r: number, start: number, end: number): string => {
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

export class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add = (vector: Vector) => {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public rotate = (angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const {x, y} = this;
        return new Vector(cos * x - sin * y, sin * x + cos * y);
    }
}