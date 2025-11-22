import mAngle, { type Angle, type Radian } from '@/math/angle';

export interface Vec2 {
    x: number;
    y: number;
}

const create = (x: number, y: number): Vec2 => ({ x, y });

const vec2Op =
    (op: (a: number, b: number) => number) =>
    (a: Vec2, ...bs: (Vec2 | number)[]): Vec2 =>
        bs.reduce<Vec2>(
            (result, b) =>
                typeof b === 'number'
                    ? create(op(result.x, b), op(result.y, b))
                    : create(op(result.x, b.x), op(result.y, b.y)),
            a,
        );

const add = vec2Op((a, b) => a + b);
const sub = vec2Op((a, b) => a - b);
const mul = vec2Op((a, b) => a * b);
const div = vec2Op((a, b) => a / b);

const length = (vec: Vec2): number => Math.hypot(vec.x, vec.y);

const distance = (a: Vec2, b: Vec2): number => length(sub(a, b));

/**
 * Rotates counterclockwise.
 */
const rotate = (vec: Vec2, angle: Angle): Vec2 => {
    const cos = Math.cos(mAngle.toRadian(angle).value);
    const sin = Math.sin(mAngle.toRadian(angle).value);

    return {
        x: vec.x * cos - vec.y * sin,
        y: vec.x * sin + vec.y * cos,
    };
};

const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

const cross = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;

/**
 * Get angle between a and b in range [-PI, PI].
 */
const angleBetween = (a: Vec2, b: Vec2): Radian =>
    mAngle.radian(Math.atan2(cross(a, b), dot(a, b)));

const mVec2 = {
    create,
    add,
    sub,
    mul,
    div,
    length,
    distance,
    rotate,
    dot,
    cross,
    angleBetween,
};

export default mVec2;
