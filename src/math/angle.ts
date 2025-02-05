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

export const degree = (value: number): Degree => ({
    unit: AngleUnit.Degree,
    value,
});

export const radian = (value: number): Radian => ({
    unit: AngleUnit.Radian,
    value,
});

const radToDegFactor = 180.0 / Math.PI;

export const toDegree = (angle: Angle): Degree =>
    angle.unit === AngleUnit.Degree
        ? angle
        : degree(angle.value * radToDegFactor);

export const toRadian = (angle: Angle): Radian =>
    angle.unit === AngleUnit.Radian
        ? angle
        : radian(angle.value / radToDegFactor);
