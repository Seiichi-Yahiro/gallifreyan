import mAngle from '@/math/angle';
import mVec2, { type Vec2 } from '@/math/vec';

export interface Circle {
    radius: number;
    position: Vec2;
}

export enum CircleIntersectionType {
    None = 'None',
    Infinity = 'Infinity',
    One = 'One',
    Two = 'Two',
}

export interface NoCircleIntersections {
    type: CircleIntersectionType.None;
}

export interface InfinityCircleIntersections {
    type: CircleIntersectionType.Infinity;
}

export interface OneCircleIntersections {
    type: CircleIntersectionType.One;
    value: Vec2;
}

export interface TwoCircleIntersections {
    type: CircleIntersectionType.Two;
    values: [Vec2, Vec2];
}

export type CircleIntersections =
    | NoCircleIntersections
    | InfinityCircleIntersections
    | OneCircleIntersections
    | TwoCircleIntersections;

/**
 * The calculation is done in a different coordinate system with the following 2 assumptions:
 * - Circle a is assumed to be placed at the origin.
 * - Circle b is assumed to be placed on the x-Axis.
 *
 *
 * x and y are the positions of the intersections
 *
 * c is the distance between the circles
 *
 * `x² + y² = r_a²`
 * `(c - x)² + y² = r_b²`
 *
 * `x = (r_a² + c² - b²) / 2 * c`
 * `y_1,2 = +-sqrt(r_a² - x²)`
 *
 * Translate x and y back into the original coordinate system
 *
 * `unit_x = normalize(b_pos - a_pos)`
 * `unit_y = rotate(unit_x, 90° counterclockwise)`
 *
 * `q1,2 = a_pos + x * unit_x +- y * unit_y`
 *
 * Based on http://walter.bislins.ch/blog/index.asp?page=Schnittpunkte+zweier+Kreise+berechnen+%28JavaScript%29
 */
const intersections = (a: Circle, b: Circle): CircleIntersections => {
    const aToB = mVec2.sub(b.position, a.position);
    const distance = mVec2.length(aToB);

    if (distance === 0) {
        return {
            type:
                a.radius === b.radius
                    ? CircleIntersectionType.Infinity
                    : CircleIntersectionType.None,
        };
    }

    const aRadiusSquared = a.radius * a.radius;
    const bRadiusSquared = b.radius * b.radius;
    const distanceSquared = distance * distance;

    const x =
        (aRadiusSquared + distanceSquared - bRadiusSquared) / (2 * distance);

    const determinant = aRadiusSquared - x * x;

    if (determinant < 0) {
        return { type: CircleIntersectionType.None };
    }

    const y = Math.sqrt(determinant);

    // translate intersection points x and y back into original coordinate system
    const xUnit = mVec2.div(aToB, distance); // normalize
    const yUnit = mVec2.rotate(xUnit, mAngle.degree(90)); // rotate 90° left;

    const xTranslation = mVec2.mul(xUnit, x);
    const yTranslation = mVec2.mul(yUnit, y);

    const q1 = mVec2.add(a.position, xTranslation, yTranslation);

    if (determinant === 0) {
        return { type: CircleIntersectionType.One, value: q1 };
    } else {
        const q2 = mVec2.sub(mVec2.add(a.position, xTranslation), yTranslation);
        return { type: CircleIntersectionType.Two, values: [q1, q2] };
    }
};

const mCircle = {
    intersections,
};

export default mCircle;
