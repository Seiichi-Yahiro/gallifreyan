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

const mAngle = {
    degree,
    radian,
    toDegree,
    toRadian,
};

export default mAngle;
