import {
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mPolar from '@/math/polar';
import mVec2 from '@/math/vec';
import { chunk } from 'es-toolkit';

/**
 * Sort angles counterclockwise.
 * Arcs should be drawn from bigger angle to smaller angle.
 * Except if the angle origin (bottom) is included.
 */
export const sortIntersectionsByAngle = (
    circle1: MCircle,
    circle2: MCircle,
    [intersection1, intersection2]: TwoCircleIntersections['values'],
): TwoCircleIntersections['values'] => {
    const angle1 = mPolar.angleFromCartesian(intersection1).value;
    const angle2 = mPolar.angleFromCartesian(intersection2).value;

    const angleOrigin = mVec2.add(
        circle1.position,
        mVec2.create(0, -circle1.radius),
    );

    const distance =
        mVec2.distance(circle2.position, angleOrigin) - circle2.radius;

    const isAngleOriginInside = distance <= 0;

    // truth table
    // o & (a < b): a,b
    // o & !(a < b): b,a
    //!o & (a < b): b,a
    //!o & !(a < b): a,b
    if (isAngleOriginInside === angle1 <= angle2) {
        return [intersection1, intersection2];
    } else {
        return [intersection2, intersection1];
    }
};

export const wordArcsFromIntersections = (
    intersections: TwoCircleIntersections['values'][],
): TwoCircleIntersections['values'][] => {
    if (intersections.length === 0) {
        return [];
    }

    const flatIntersections = intersections.map(([a, b]) => [b, a]).flat();

    return chunk(
        [...flatIntersections.slice(1), flatIntersections[0]],
        2,
    ) as TwoCircleIntersections['values'][];
};
