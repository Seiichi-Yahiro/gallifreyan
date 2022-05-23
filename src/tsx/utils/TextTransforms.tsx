import { range, zip } from 'lodash';
import { ImageState } from '../state/image/ImageReducer';
import {
    Circle,
    ImageType,
    Consonant,
    ConsonantPlacement,
    Dot,
    Letter,
    PositionData,
    Sentence,
    UUID,
    Vocal,
    VocalDecoration,
    VocalPlacement,
    Word,
} from '../state/image/ImageTypes';
import { Degree, rotate, toRadian, Vector2 } from './LinearAlgebra';

const zipEqual: <T1, T2>(array1: T1[], array2: T2[]) => [T1, T2][] = zip;

export const adjustAngle = (angle: Degree): Degree => ((angle % 360) + 360) % 360;

export const calculateTranslation = (angle: number, distance: number): Vector2 =>
    rotate({ x: 0, y: distance }, toRadian(-angle));

export const calculateInitialSentenceCircleData = (svgSize: number): Circle => ({
    angle: 0,
    distance: 0,
    r: (svgSize / 2) * 0.9,
});

export const calculateInitialWordCircleData = (sentenceRadius: number, numberOfWords: number): Circle[] => {
    const wordAngle = 360 / numberOfWords;
    const r = (sentenceRadius * 0.75) / (1 + numberOfWords / 2);
    const distance = numberOfWords > 1 ? sentenceRadius - r * 1.5 : 0;

    return range(numberOfWords).map((i) => ({
        angle: adjustAngle(i * wordAngle),
        distance,
        r,
    }));
};

export const calculateInitialLetterCircleData = (letters: Letter[], wordRadius: number): Circle[] => {
    const letterAngle = 360 / letters.length;

    return letters.map((letter, i) => {
        const angle = adjustAngle(i * letterAngle);
        const r =
            letter.type === ImageType.Vocal
                ? (wordRadius * 0.75 * 0.4) / (1 + letters.length / 2)
                : (wordRadius * 0.75) / (1 + letters.length / 2);
        let distance;

        switch (letter.placement) {
            case ConsonantPlacement.DeepCut:
                distance = wordRadius - r * 0.75;
                break;
            case ConsonantPlacement.ShallowCut:
                distance = wordRadius;
                break;
            case ConsonantPlacement.Inside:
                distance = letters.length > 1 ? wordRadius - r * 1.5 : 0;
                break;
            case VocalPlacement.Outside:
                distance = wordRadius + r * 1.5;
                break;
            case VocalPlacement.Inside:
                distance = wordRadius - r * 1.5;
                break;
            case ConsonantPlacement.OnLine:
                distance = wordRadius;
                break;
            case VocalPlacement.OnLine:
                distance = wordRadius;
                break;
        }

        return { angle, distance, r };
    });
};

export const calculateInitialNestedVocalCircleData = (
    vocalPlacement: VocalPlacement,
    parentConsonantPlacement: ConsonantPlacement,
    consonantCircleData: Circle,
    wordRadius: number
): Circle => {
    const r = consonantCircleData.r * 0.4;

    switch (vocalPlacement) {
        case VocalPlacement.OnLine:
            if (parentConsonantPlacement === ConsonantPlacement.ShallowCut) {
                return {
                    r,
                    angle: 0,
                    distance: wordRadius - consonantCircleData.distance,
                };
            } else {
                return {
                    r,
                    angle: 0,
                    distance: 0,
                };
            }
        case VocalPlacement.Outside:
            return {
                r,
                angle: 0,
                distance: wordRadius - consonantCircleData.distance + r * 1.5,
            };
        case VocalPlacement.Inside:
            return {
                r,
                angle: 180,
                distance: consonantCircleData.r,
            };
    }
};

export const calculateInitialDotCircleData = (letterRadius: number, numberOfDots: number): Circle[] => {
    const letterSideAngle = 180;
    const dotDistanceAngle = 45;
    const centerDotsOnLetterSideAngle = ((numberOfDots - 1) * dotDistanceAngle) / 2;

    const r = letterRadius * 0.1;
    const distance = letterRadius - r * 1.5;

    return range(numberOfDots).map((i) => ({
        angle: adjustAngle(i * dotDistanceAngle - centerDotsOnLetterSideAngle + letterSideAngle),
        distance,
        r,
    }));
};

export const calculateInitialLineSlotPositionData = (
    letterRadius: number,
    numberOfLines: number,
    pointOutside: boolean
): PositionData[] => {
    const letterSideAngle = pointOutside ? 0 : 180;
    const lineDistanceAngle = 45;
    const centerLinesOnLetterSideAngle = ((numberOfLines - 1) * lineDistanceAngle) / 2;

    return range(numberOfLines).map((i) => ({
        distance: letterRadius,
        angle: adjustAngle(i * lineDistanceAngle - centerLinesOnLetterSideAngle + letterSideAngle),
    }));
};

export const resetCircleAndLineSlotData = (state: ImageState) => resetSentenceCircleData(state, state.rootCircleId);

const resetSentenceCircleData = (state: ImageState, id: UUID) => {
    const sentence = state.circles[id] as Sentence;
    sentence.circle = calculateInitialSentenceCircleData(state.svgSize);

    zipEqual(sentence.words, calculateInitialWordCircleData(sentence.circle.r, sentence.words.length)).forEach(
        ([wordId, wordCircleData]) => {
            resetWordCircleData(state, wordId, wordCircleData);
        }
    );
};

const resetWordCircleData = (state: ImageState, id: UUID, wordCircleData: Circle) => {
    const word = state.circles[id] as Word;
    word.circle = wordCircleData;

    const letters = word.letters.map((letterId) => state.circles[letterId] as Letter);

    zipEqual(letters, calculateInitialLetterCircleData(letters, word.circle.r)).forEach(
        ([letter, letterCircleData]) => {
            resetLetterCircleData(state, letter, letterCircleData);
        }
    );
};

const resetLetterCircleData = (state: ImageState, letter: Letter, circleData: Circle) => {
    if (letter.type === ImageType.Consonant) {
        resetConsonantCircleData(state, letter, circleData);
    } else {
        resetVocalCircleData(state, letter, circleData);
    }
};

const resetVocalCircleData = (state: ImageState, vocal: Vocal, circleData: Circle) => {
    vocal.circle = circleData;

    const lineSlotData = calculateInitialLineSlotPositionData(
        vocal.circle.r,
        vocal.lineSlots.length,
        vocal.decoration === VocalDecoration.LineOutside
    );

    zipEqual(vocal.lineSlots, lineSlotData).forEach(([slotId, positionData]) => {
        const lineSlot = state.lineSlots[slotId]!;
        lineSlot.angle = positionData.angle;
        lineSlot.distance = positionData.distance;
    });
};

const resetConsonantCircleData = (state: ImageState, consonant: Consonant, circleData: Circle) => {
    consonant.circle = circleData;
    const parent = state.circles[consonant.parentId]!;

    const lineSlotData = calculateInitialLineSlotPositionData(consonant.circle.r, consonant.lineSlots.length, false);
    zipEqual(consonant.lineSlots, lineSlotData).forEach(([slotId, positionData]) => {
        const lineSlot = state.lineSlots[slotId]!;
        lineSlot.angle = positionData.angle;
        lineSlot.distance = positionData.distance;
    });

    const dotCircleData = calculateInitialDotCircleData(consonant.circle.r, consonant.dots.length);
    zipEqual(consonant.dots, dotCircleData).forEach(([dotId, circleData]) => {
        const dot = state.circles[dotId] as Dot;
        dot.circle = circleData;
    });

    if (consonant.vocal) {
        const vocal = state.circles[consonant.vocal] as Vocal;

        const circleData = calculateInitialNestedVocalCircleData(
            vocal.placement,
            consonant.placement,
            consonant.circle,
            parent.circle.r
        );

        resetVocalCircleData(state, vocal, circleData);
    }
};
