export interface Dimension2 {
    x: number;
    y: number;
}

export interface Position extends Dimension2 {}

export interface Vector2 extends Dimension2 {}

export type Radian = number;
export type Degree = number;

export const add = (a: Dimension2, b: Dimension2): Dimension2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Dimension2, b: Dimension2): Dimension2 => ({ x: a.x - b.x, y: a.y - b.y });
export const div = (d2: Dimension2, value: number): Dimension2 => ({ x: d2.x / value, y: d2.y / value });
export const mul = (d2: Dimension2, value: number): Dimension2 => ({ x: d2.x * value, y: d2.y * value });

export const normalize = (v: Vector2): Vector2 => {
    const l = length(v);
    return l === 0 ? { x: 0, y: 0 } : div(v, l);
};

export const toRadian = (degree: Degree): Radian => degree * (Math.PI / 180);

export const toDegree = (radian: Radian): Degree => radian * (180 / Math.PI);

export const dot = (v1: Vector2, v2: Vector2): number => v1.x * v2.x + v1.y * v2.y;
export const det = (v1: Vector2, v2: Vector2): number => v1.x * v2.y - v1.y * v2.x;

export const length = (v: Vector2): number => Math.hypot(v.x, v.y);

export const angleBetween = (v1: Vector2, v2: Vector2): Radian => Math.atan2(det(v1, v2), dot(v1, v2));

export const rotate = (v: Dimension2, angle: Radian): Dimension2 => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: v.x * cos - v.y * sin,
        y: v.x * sin + v.y * cos,
    };
};

export const clamp = (value: number, min: number, max: number): number => {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
};
