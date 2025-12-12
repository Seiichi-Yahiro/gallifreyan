const MIN = 0;
const MAX_DEG = 360;
const MAX_RAD = Math.PI * 2;

export enum AngleUnit {
    Degree = 'deg',
    Radian = 'rad',
}

export interface Degree {
    unit: AngleUnit.Degree;
    value: number;
}

export interface Radian {
    unit: AngleUnit.Radian;
    value: number;
}

export type Angle = Degree | Radian;

const degree = (value: number): Degree => ({
    unit: AngleUnit.Degree,
    value,
});

const radian = (value: number): Radian => ({
    unit: AngleUnit.Radian,
    value,
});

const radToDegFactor = 180.0 / Math.PI;

const toDegree = (angle: Angle): Degree =>
    angle.unit === AngleUnit.Degree
        ? angle
        : degree(angle.value * radToDegFactor);

const toRadian = (angle: Angle): Radian =>
    angle.unit === AngleUnit.Radian
        ? angle
        : radian(angle.value / radToDegFactor);

const toUnit = (angle: Angle, unit: AngleUnit): Angle =>
    unit === AngleUnit.Degree ? toDegree(angle) : toRadian(angle);

/**
 * Maps the angle to the range [0, 360) or [0, 2PI).
 */
const normalize = <T extends Angle>(angle: T): T => {
    const max = angle.unit === AngleUnit.Degree ? 360 : Math.PI * 2;

    return {
        unit: angle.unit,
        value: ((angle.value % max) + max) % max,
    } as T;
};

/**
 * Clamps angle to nearest min or max.
 * Min cannot be smaller than 0.
 * Max cannot be bigger than MAX_UNIT (360 or 2PI).
 */
const clamp = <T extends Angle>(angle: T, min: number, max: number): T => {
    const value = angle.value;
    const MAX = angle.unit === AngleUnit.Degree ? MAX_DEG : MAX_RAD;

    if (
        min > max &&
        ((value >= min && value < MAX) || (value >= MIN && value <= max))
    ) {
        return angle;
    } else if (value < min || value > max) {
        const minDiff = Math.abs(value - min);
        const minDistance = Math.min(minDiff, MAX - minDiff);

        const maxDiff = Math.abs(value - max);
        const maxDistance = Math.min(maxDiff, MAX - maxDiff);

        if (minDistance < maxDistance) {
            return { unit: angle.unit, value: min } as T;
        } else {
            return { unit: angle.unit, value: max } as T;
        }
    } else {
        return angle;
    }
};

const angleOp =
    (op: (a: number, b: number) => number) =>
    <T extends Angle>(a: T, ...bs: (Angle | number)[]): T =>
        bs.reduce<T>((result, b) => {
            if (typeof b === 'number') {
                return { unit: result.unit, value: op(result.value, b) } as T;
            }

            if (result.unit === AngleUnit.Degree) {
                return {
                    unit: result.unit,
                    value: op(result.value, toDegree(b).value),
                } as T;
            } else {
                return {
                    unit: result.unit,
                    value: op(result.value, toRadian(b).value),
                } as T;
            }
        }, a);

const add = angleOp((a, b) => a + b);
const sub = angleOp((a, b) => a - b);
const mul = angleOp((a, b) => a * b);
const div = angleOp((a, b) => a / b);

const mAngle = {
    MIN,
    MAX_DEG,
    MAX_RAD,
    degree,
    radian,
    toDegree,
    toRadian,
    toUnit,
    normalize,
    clamp,
    add,
    sub,
    mul,
    div,
};

export default mAngle;
