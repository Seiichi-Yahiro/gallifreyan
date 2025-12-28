import mAngle, { type Radian } from '@/math/angle';
import type { LetterId, WordId } from '@/redux/ids';
import type {
    AngleConstraints,
    DistanceConstraints,
} from '@/redux/svg/constraints.types';
import type { CirclesDict } from '@/redux/svg/svg.types';
import { clamp } from 'es-toolkit';

export const noAngleConstraints = (): AngleConstraints => {
    return {
        min: mAngle.radian(0),
        max: mAngle.radian(Math.PI * 2.0),
    };
};

export const betweenNeighborsAngleConstraints = <ID extends WordId | LetterId>(
    index: number,
    siblingIds: ID[],
    circles: CirclesDict,
): AngleConstraints => {
    const constraints = noAngleConstraints();

    if (index > 0) {
        const previousWordId = siblingIds[index - 1];
        constraints.min = circles[previousWordId].position.angle;
    }

    if (index < siblingIds.length - 1) {
        const nextWordId = siblingIds[index + 1];
        constraints.max = circles[nextWordId].position.angle;
    }

    return constraints;
};

export const applyAngleConstraints = (
    angle: Radian,
    constraints: AngleConstraints,
): Radian => {
    return mAngle.clamp(angle, constraints.min.value, constraints.max.value);
};

export const insideDistanceConstraints = (
    radius: number,
    parentRadius: number,
): DistanceConstraints => {
    return {
        min: 0,
        max: parentRadius - radius,
    };
};

export const outsideDistanceConstraints = (
    radius: number,
    parentRadius: number,
): DistanceConstraints => {
    return {
        min: parentRadius + radius,
        max: parentRadius + radius + radius * 0.5,
    };
};

export const onlineDistanceConstraints = (
    parentRadius: number,
): DistanceConstraints => {
    return {
        min: parentRadius,
        max: parentRadius,
    };
};

export const deepCutDistanceConstraints = (
    radius: number,
    parentRadius: number,
): DistanceConstraints => {
    return {
        min: parentRadius - radius * 0.95,
        max: parentRadius - radius * 0.55,
    };
};

export const shallowCutDistanceConstraints = (
    radius: number,
    parentRadius: number,
): DistanceConstraints => {
    return {
        min: parentRadius,
        max: parentRadius + radius * 0.95,
    };
};

export const applyDistanceConstraints = (
    distance: number,
    constraints: DistanceConstraints,
): number => {
    return clamp(distance, constraints.min, constraints.max);
};
