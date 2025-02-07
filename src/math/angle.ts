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

const normalize = <T extends Angle>(angle: T): T => {
    const max = angle.unit === AngleUnit.Degree ? 360 : Math.PI * 2;

    return {
        unit: angle.unit,
        value: ((angle.value % max) + max) % max,
    } as T;
};

const mAngle = {
    degree,
    radian,
    toDegree,
    toRadian,
    normalize,
};

export default mAngle;
