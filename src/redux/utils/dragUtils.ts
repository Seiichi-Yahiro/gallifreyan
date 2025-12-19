import type { Angle } from '@/math/angle';
import mPolar, { type PolarCoordinate } from '@/math/polar';
import mVec2, { type Vec2 } from '@/math/vec';

export const calculatePositionAfterDrag = (
    currentPos: PolarCoordinate,
    delta: Vec2,
    parentAngle?: Angle,
): PolarCoordinate => {
    const pos = mPolar.toCartesian(currentPos);

    const rotatedDelta = parentAngle
        ? mVec2.rotate(delta, parentAngle, true)
        : delta;

    return mPolar.fromCartesian(mVec2.add(pos, rotatedDelta));
};
