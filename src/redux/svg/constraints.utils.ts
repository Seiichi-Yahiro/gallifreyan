import mAngle, { type Radian } from '@/math/angle';
import type { LetterId, WordId } from '@/redux/ids';
import type {
    AngleConstraints,
    DistanceConstraints,
    RadiusConstraints,
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
    strokeWidth: number,
): DistanceConstraints => {
    const halfStrokeWidth = strokeWidth / 2;

    const parentInnerRadius = parentRadius - halfStrokeWidth;
    const selfOuterRadius = radius + halfStrokeWidth;

    return {
        min: 0,
        max: parentInnerRadius - selfOuterRadius,
    };
};

export const outsideDistanceConstraints = (
    radius: number,
    parentRadius: number,
    strokeWidth: number,
): DistanceConstraints => {
    const halfStrokeWidth = strokeWidth / 2;

    const parentOuterRadius = parentRadius + halfStrokeWidth;
    const selfOuterRadius = radius + halfStrokeWidth;
    const min = parentOuterRadius + selfOuterRadius;

    return {
        min,
        max: min + selfOuterRadius * 0.5,
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
    strokeWidth: number,
): DistanceConstraints => {
    const halfStrokeWidth = strokeWidth / 2;
    const parentInnerRadius = parentRadius - halfStrokeWidth;

    return {
        min: parentInnerRadius - radius * 0.95,
        max: parentInnerRadius - radius * 0.55,
    };
};

export const shallowCutDistanceConstraints = (
    radius: number,
    parentRadius: number,
    strokeWidth: number,
): DistanceConstraints => {
    const halfStrokeWidth = strokeWidth / 2;
    const parentInnerRadius = parentRadius - halfStrokeWidth;

    return {
        min: parentInnerRadius,
        max: parentInnerRadius + radius * 0.95,
    };
};

export const applyDistanceConstraints = (
    distance: number,
    constraints: DistanceConstraints,
): number => {
    return clamp(distance, constraints.min, constraints.max);
};

export const strokeWidthRadiusConstraints = (
    strokeWidth: number,
): RadiusConstraints => {
    return {
        min: 1 + strokeWidth / 2,
        max: Number.MAX_SAFE_INTEGER,
    };
};

export const applyRadiusConstraints = (
    radius: number,
    constraints: RadiusConstraints,
): number => {
    return clamp(radius, constraints.min, constraints.max);
};
