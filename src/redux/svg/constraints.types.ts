import type { Radian } from '@/math/angle';

export type PositionConstraints = {
    distance: DistanceConstraints;
    angle: AngleConstraints;
};

export type DistanceConstraints = {
    min: number;
    max: number;
};

export type AngleConstraints = {
    min: Radian;
    max: Radian;
};

export type RadiusConstraints = {
    min: number;
    max: number;
};
