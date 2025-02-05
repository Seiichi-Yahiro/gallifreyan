import { type Angle, toRadian } from '@/math/angle';
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

const rotate = (vec: Vec2, angle: Angle): Vec2 => {
    const cos = Math.cos(toRadian(angle).value);
    const sin = Math.sin(toRadian(angle).value);

    return {
        x: vec.x * cos - vec.y * sin,
        y: vec.x * sin + vec.y * cos,
    };
};

export const vec2 = {
    create,
    add,
    sub,
    mul,
    div,
    length,
    rotate,
};
