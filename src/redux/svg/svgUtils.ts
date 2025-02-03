import { degree } from '@/math/angle';
import type { Circle, LineSlot, PositionData } from '@/redux/svg/svgTypes';
import { ConsonantPlacement, VocalPlacement } from '@/redux/text/letterTypes';

export const defaultCircle = (): Circle => ({
    radius: 0,
    position: {
        distance: 0,
        angle: degree(0),
    },
});

export const defaultLineSlot = (): LineSlot => ({
    position: {
        distance: 0,
        angle: degree(0),
    },
});

export const defaultSentenceRadius = (svgSize: number): number =>
    (svgSize * 0.9) / 2;

export const defaultSentencePosition = (): PositionData => ({
    distance: 0,
    angle: degree(0),
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
    angle: degree(index * (360 / numberOfWords)),
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
    const distance = {
        [VocalPlacement.OnLine]: wordRadius,
        [VocalPlacement.Outside]: wordRadius + letterRadius * 1.5,
        [VocalPlacement.Inside]:
            numberOfLetters > 1 ? wordRadius - letterRadius * 1.5 : 0,
    }[placement];

    const angle = index * (360 / numberOfLetters);

    return {
        distance,
        angle: degree(angle),
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
    const distance = {
        [ConsonantPlacement.DeepCut]: wordRadius - letterRadius * 0.75,
        [ConsonantPlacement.Inside]:
            numberOfLetters > 1 ? wordRadius - letterRadius * 1.5 : 0,
        [ConsonantPlacement.ShallowCut]: wordRadius,
        [ConsonantPlacement.OnLine]: wordRadius,
    }[placement];

    const angle = index * (360 / numberOfLetters);

    return {
        distance,
        angle: degree(angle),
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

    const distance = consonantRadius - dotRadius * 1.5;

    const angle =
        index * dotDistanceAngle -
        centerDotsOnLetterSideAngle +
        letterSideAngle;

    return {
        distance,
        angle: degree(angle),
    };
};
