import mAngle from '@/math/angle';
import {
    type Circle as MCircle,
    type TwoCircleIntersections,
} from '@/math/circle';
import mVec2, { type Vec2 } from '@/math/vec';
import type { CircleI, PositionData } from '@/redux/svg/svgTypes';
import { ConsonantPlacement, VocalPlacement } from '@/redux/text/letterTypes';
import { chunk } from 'lodash';
import { match } from 'ts-pattern';

export const defaultCircle = (): CircleI => ({
    radius: 0,
    position: {
        distance: 0,
        angle: mAngle.degree(0),
    },
});

export const defaultSentenceRadius = (svgSize: number): number =>
    (svgSize * 0.9) / 2;

export const defaultSentencePosition = (): PositionData => ({
    distance: 0,
    angle: mAngle.degree(0),
});

export const defaultWordRadius = (
    sentenceRadius: number,
    numberOfWords: number,
): number => (sentenceRadius * 0.75) / (1 + numberOfWords / 2.0);

export const defaultWordPosition = (
    sentenceRadius: number,
    wordRadius: number,
    numberOfWords: number,
    index: number,
): PositionData => ({
    distance: numberOfWords > 1 ? sentenceRadius - wordRadius * 1.5 : 0,
    angle: mAngle.degree(index * (360 / numberOfWords)),
});

export const defaultVocalRadius = (
    wordRadius: number,
    numberOfLetters: number,
): number => (wordRadius * 0.75 * 0.4) / (1 + numberOfLetters / 2);

export const defaultVocalPosition = (
    wordRadius: number,
    letterRadius: number,
    numberOfLetters: number,
    placement: VocalPlacement,
    index: number,
): PositionData => {
    const distance = match(placement)
        .with(VocalPlacement.OnLine, () => wordRadius)
        .with(VocalPlacement.Outside, () => wordRadius + letterRadius * 1.5)
        .with(VocalPlacement.Inside, () =>
            numberOfLetters > 1 ? wordRadius - letterRadius * 1.5 : 0,
        )
        .exhaustive();

    const angle = index * (360 / numberOfLetters);

    return {
        distance,
        angle: mAngle.degree(angle),
    };
};

export const defaultConsonantRadius = (
    wordRadius: number,
    numberOfLetters: number,
): number => (wordRadius * 0.75) / (1 + numberOfLetters / 2);

export const defaultConsonantPosition = (
    wordRadius: number,
    letterRadius: number,
    numberOfLetters: number,
    placement: ConsonantPlacement,
    index: number,
): PositionData => {
    const distance = match(placement)
        .with(
            ConsonantPlacement.DeepCut,
            () => wordRadius - letterRadius * 0.75,
        )
        .with(ConsonantPlacement.Inside, () =>
            numberOfLetters > 1 ? wordRadius - letterRadius * 1.5 : 0,
        )
        .with(
            ConsonantPlacement.ShallowCut,
            ConsonantPlacement.OnLine,
            () => wordRadius,
        )
        .exhaustive();

    const angle = index * (360 / numberOfLetters);

    return {
        distance,
        angle: mAngle.degree(angle),
    };
};

export const defaultDotRadius = (consonantRadius: number): number =>
    consonantRadius * 0.1;

export const defaultDotPosition = (
    consonantRadius: number,
    dotRadius: number,
    numberOfDots: number,
    index: number,
): PositionData => {
    const letterSideAngle = 180;
    const dotDistanceAngle = 45;

    const centerDotsOnLetterSideAngle =
        ((numberOfDots - 1) * dotDistanceAngle) / 2;

    const distance = consonantRadius - dotRadius * 2;

    const angle =
        index * dotDistanceAngle -
        centerDotsOnLetterSideAngle +
        letterSideAngle;

    return {
        distance,
        angle: mAngle.degree(angle),
    };
};

export const defaultLineSlotPosition = (
    letterRadius: number,
    numberOfLines: number,
    index: number,
    pointOutside: boolean,
): PositionData => {
    const letterSideAngle = pointOutside ? 0 : 180;
    const lineDistanceAngle = 45;

    const centerLinesOnLetterSideAngle =
        ((numberOfLines - 1) * lineDistanceAngle) / 2;

    const distance = letterRadius;

    const angle =
        index * lineDistanceAngle -
        centerLinesOnLetterSideAngle +
        letterSideAngle;

    return {
        distance,
        angle: mAngle.degree(angle),
    };
};

/**
 * Rotate counterclockwise starting from the bottom.
 */
export const circleTransform = (positionData: PositionData): Vec2 =>
    mVec2.rotate(mVec2.create(0, -positionData.distance), positionData.angle);

/**
 * Rotate counterclockwise starting from the bottom.
 * Gives values in range [0, 2Pi].
 */
export const angleFromVec = (vec: Vec2) =>
    mAngle.normalize(mVec2.angleBetween(mVec2.create(0, -1), vec));

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
    const angle1 = angleFromVec(intersection1).value;
    const angle2 = angleFromVec(intersection2).value;

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
    const flatIntersections = intersections.map(([a, b]) => [b, a]).flat();
    return chunk(
        [...flatIntersections.slice(1), flatIntersections[0]],
        2,
    ) as TwoCircleIntersections['values'][];
};
