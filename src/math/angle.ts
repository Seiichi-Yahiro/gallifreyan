export enum AngleUnit {
    Degree = 'deg',
    Radian = 'rad',
}

const MIN = 0;
const MAX_DEG = 360;
const MAX_RAD = Math.PI * 2;

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

const mAngle = {
    degree,
    radian,
    toDegree,
    toRadian,
    normalize,
    clamp,
    MIN,
    MAX_DEG,
    MAX_RAD,
};

export default mAngle;
