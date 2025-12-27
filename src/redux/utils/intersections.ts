import mCircle, {
    CircleIntersectionType,
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mPolar from '@/math/polar';
import mVec2 from '@/math/vec';
import type { Arc, PolarCircle } from '@/redux/types/svgTypes';
import { chunk } from 'es-toolkit';

/**
 * Converts intersections to polar coordinates and sorts them by angle.
 * Arcs are drawn counterclockwise starting from the bottom.
 * Usually arcs are sorted from small to big angle but
 * if the second circle includes the 0 degrees location then the arc direction
 * goes from big to small angle.
 */
export const intersectionsToArc = (
    circle1: MCircle,
    circle2: MCircle,
    [intersection1, intersection2]: TwoCircleIntersections['values'],
): Arc => {
    const angle1 = mPolar.angleFromCartesian(intersection1);
    const angle2 = mPolar.angleFromCartesian(intersection2);

    // point at bottom (0 degrees) of first circle
    const angleOrigin = mVec2.add(
        circle1.position,
        mVec2.create(0, -circle1.radius),
    );

    const distance =
        mVec2.distance(circle2.position, angleOrigin) - circle2.radius;

    const isAngleOriginInside = distance <= 0;

    // truth table
    // o & (a < b): b,a
    // o & !(a < b): a,b
    //!o & (a < b): a,b
    //!o & !(a < b): b,a
    // its a XOR
    if (isAngleOriginInside === angle1.value <= angle2.value) {
        return {
            start: angle2,
            end: angle1,
        };
    } else {
        return {
            start: angle1,
            end: angle2,
        };
    }
};

export const antiArcsToArcs = (antiArcs: Arc[]): Arc[] => {
    if (antiArcs.length === 0) {
        return [];
    }

    const flatAntiArcs = antiArcs.flatMap((arc) => [arc.start, arc.end]);

    return chunk([...flatAntiArcs.slice(1), flatAntiArcs[0]], 2).map(
        (chunk): Arc => ({
            start: chunk[0],
            end: chunk[1],
        }),
    );
};

export type LetterWordIntersections = {
    letterArc: Arc;
    wordAntiArc: Arc;
};

export const calculateIntersectionsBetweenLetterAndWord = (
    wordRadius: number,
    letterCircle: PolarCircle,
): LetterWordIntersections | undefined => {
    const wordMCircle: MCircle = {
        radius: wordRadius,
        position: mVec2.create(0, 0),
    };

    const letterMCircle: MCircle = {
        radius: letterCircle.radius,
        position: mPolar.toCartesian(letterCircle.position),
    };

    const intersectionsInWord = mCircle.intersections(
        wordMCircle,
        letterMCircle,
    );

    if (intersectionsInWord.type !== CircleIntersectionType.Two) {
        return;
    }

    // these are the arcs of the word that should not be drawn because they are blocked by the letters
    const antiArcInWord = intersectionsToArc(
        wordMCircle,
        letterMCircle,
        intersectionsInWord.values,
    );

    const intersectionsAnglesInLetter = intersectionsInWord.values
        .map((pos) => mVec2.sub(pos, letterMCircle.position))
        .map((pos) => mVec2.rotate(pos, letterCircle.position.angle, true))
        .map(mPolar.angleFromCartesian)
        .sort((a, b) => a.value - b.value); // sorting is fine because intersections will never include the 0 degrees point

    const letterArc: Arc = {
        start: intersectionsAnglesInLetter[0],
        end: intersectionsAnglesInLetter[1],
    };

    return {
        letterArc: letterArc,
        wordAntiArc: antiArcInWord,
    };
};
