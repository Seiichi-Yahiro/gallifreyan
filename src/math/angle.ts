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

export const degree = (value: number): Degree => ({
    unit: AngleUnit.Degree,
    value,
});

export const radian = (value: number): Radian => ({
    unit: AngleUnit.Radian,
    value,
});

const radToDegFactor = 180.0 / Math.PI;

export const toDegree = (radian: Radian): Degree =>
    degree(radian.value * radToDegFactor);

export const toRadian = (degree: Degree): Radian =>
    radian(degree.value / radToDegFactor);
