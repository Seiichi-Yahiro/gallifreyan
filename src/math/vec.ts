import mAngle, { type Angle, type Radian } from '@/math/angle';
import { isNumber } from 'lodash';

export interface Vec2 {
    x: number;
    y: number;
}

const create = (x: number, y: number): Vec2 => ({ x, y });

const add = (a: Vec2, ...bs: (Vec2 | number)[]): Vec2 =>
    bs.reduce<Vec2>(
        (sum, b) =>
            isNumber(b)
                ? create(sum.x + b, sum.y + b)
                : create(sum.x + b.x, sum.y + b.y),
        a,
    );

const sub = (a: Vec2, ...bs: (Vec2 | number)[]): Vec2 =>
    bs.reduce<Vec2>(
        (sum, b) =>
            isNumber(b)
                ? create(sum.x - b, sum.y - b)
                : create(sum.x - b.x, sum.y - b.y),
        a,
    );

const mul = (a: Vec2, ...bs: (Vec2 | number)[]): Vec2 =>
    bs.reduce<Vec2>(
        (sum, b) =>
            isNumber(b)
                ? create(sum.x * b, sum.y * b)
                : create(sum.x * b.x, sum.y * b.y),
        a,
    );

const div = (a: Vec2, ...bs: (Vec2 | number)[]): Vec2 =>
    bs.reduce<Vec2>(
        (sum, b) =>
            isNumber(b)
                ? create(sum.x / b, sum.y / b)
                : create(sum.x / b.x, sum.y / b.y),
        a,
    );

const length = (vec: Vec2): number => Math.hypot(vec.x, vec.y);

const distance = (a: Vec2, b: Vec2): number => length(sub(a, b));

/**
 * Rotates counterclockwise
 */
const rotate = (vec: Vec2, angle: Angle): Vec2 => {
    const cos = Math.cos(mAngle.toRadian(angle).value);
    const sin = Math.sin(mAngle.toRadian(angle).value);

    return {
        x: vec.x * cos - vec.y * sin,
        y: vec.x * sin + vec.y * cos,
    };
};

const dot = (a: Vec2, b: Vec2) => a.x * b.x + a.y * b.y;

const angleBetween = (a: Vec2, b: Vec2): Radian =>
    mAngle.radian(Math.acos(dot(a, b) / (length(a) * length(b))));

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
    angleBetween,
};

export default mVec2;
