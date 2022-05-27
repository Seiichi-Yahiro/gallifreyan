import Maybe from './Maybe';

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

/**
 * Clamp angles between 0 and 360 degrees
 * @param angle - positive angle between 0 and 360
 * @param min - positive angle between 0 and 360
 * @param max - positive angle between 0 and 360
 */
export const clampAngle = (angle: Degree, min: Degree, max: Degree): Degree => {
    if (angle < min || angle > max) {
        const minDiff = Math.abs(angle - min);
        const minDistance = Math.min(minDiff, 360 - minDiff);

        const maxDiff = Math.abs(angle - max);
        const maxDistance = Math.min(maxDiff, 360 - maxDiff);

        return minDistance < maxDistance ? min : max;
    } else {
        return angle;
    }
};

interface Circle {
    r: number;
    pos: Position;
}

/**
 * Calculate the 2 Intersection points of 2 circles.
 *
 * The calculation is done in a different coordinate system with the following 2 assumptions:
 * - Circle a is assumed to be placed at the origin.
 * - Circle b is assumed to be placed on the x-Axis.
 *
 * x and y are the positions of the intersections
 * c is the distance between the circles
 * x² + y² = r_a²
 * (c - x)² + y² = r_b²
 *
 * x = (r_a² + c² - b²) / 2 * c
 * y_1,2 = +-sqrt(r_a² - x²)
 *
 *
 * Translate x and y back into the original coordinate system
 * unit_x = normalize(b_pos - a_pos)
 * unit_y = rotate(unit_x, 90° counter clockwise)
 *
 * q1,2 = a_pos + x * unit_x +- y * unit_y
 *
 * Based on
 * http://walter.bislins.ch/blog/index.asp?page=Schnittpunkte+zweier+Kreise+berechnen+%28JavaScript%29
 *
 * @param a - Circle a
 * @param b - Circle b
 * @returns Maybe<[Position, Position]> - An optional tuple with the 2 intersections
 */
export const circleIntersections = (a: Circle, b: Circle): Maybe<[Position, Position]> => {
    const aToB = sub(b.pos, a.pos);
    const distance = length(aToB);

    // circles have the same position
    // which means they have 0 or infinity intersections
    if (distance === 0) {
        return Maybe.none();
    }

    const radiusASquared = a.r * a.r;
    const x = (radiusASquared + distance * distance - b.r * b.r) / (2 * distance);
    const determinant = radiusASquared - x * x;

    // circles have 0 or 1 intersections
    if (determinant <= 0) {
        return Maybe.none();
    }

    const y = Math.sqrt(determinant);

    // translate intersection points x and y back into the original coordinate system
    const xUnit = div(aToB, distance); // normalize
    const yUnit = rotate(xUnit, Math.PI / 2); // rotate 90° left

    const xTranslation = mul(xUnit, x);
    const yTranslation = mul(yUnit, y);

    // q1,2 = a_pos + x * unit_x +- y * unit_y
    const qx = add(a.pos, xTranslation);
    const q1 = add(qx, yTranslation);
    const q2 = sub(qx, yTranslation);

    return Maybe.some([q1, q2]);
};
