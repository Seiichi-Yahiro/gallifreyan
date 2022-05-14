import { range, zip } from 'lodash';
import { ImageState } from '../state/ImageState';
import {
    Consonant,
    ConsonantPlacement,
    Letter,
    PositionData,
    Sentence,
    Vocal,
    VocalDecoration,
    VocalPlacement,
    Word,
} from '../state/ImageTypes';
import { isLetterConsonant } from './LetterGroups';
import { Degree, rotate, toRadian, Vector2 } from './LinearAlgebra';
import Maybe from './Maybe';
import { DEFAULT_CONSONANT_RADIUS, DEFAULT_VOCAL_RADIUS } from './TextDefaultValues';

const zipEqual: <T1, T2>(array1: T1[], array2: T2[]) => [T1, T2][] = zip;

export const adjustAngle = (angle: Degree): Degree => {
    const newAngle = angle % 360;
    return newAngle > 180 ? newAngle - 360 : newAngle;
};

export const calculateTranslation = (angle: number, parentDistance: number): Vector2 =>
    rotate({ x: 0, y: parentDistance }, toRadian(-angle));

export const calculateInitialWordPositionDatas = (sentenceRadius: number, numberOfWords: number): PositionData[] => {
    const wordAngle = 360 / numberOfWords;
    return range(numberOfWords).map((i) => ({
        angle: adjustAngle(i * wordAngle),
        parentDistance: sentenceRadius - 150,
    }));
};

export const calculateInitialLetterPositionDatas = (letters: Letter[], wordRadius: number): PositionData[] => {
    const letterAngle = 360 / letters.length;

    return letters
        .map((letter) => {
            switch (letter.placement) {
                case ConsonantPlacement.DeepCut:
                    return wordRadius - (DEFAULT_CONSONANT_RADIUS / 2) * 1.25;
                case ConsonantPlacement.ShallowCut:
                    return wordRadius + DEFAULT_CONSONANT_RADIUS / 2;
                case ConsonantPlacement.Inside:
                    return wordRadius - (DEFAULT_CONSONANT_RADIUS / 2) * 2 - 5;
                case VocalPlacement.Outside:
                    return wordRadius + DEFAULT_VOCAL_RADIUS + 5;
                case VocalPlacement.Inside:
                    return wordRadius - DEFAULT_VOCAL_RADIUS - 5;
                case ConsonantPlacement.OnLine:
                case VocalPlacement.OnLine:
                    return wordRadius;
            }
        })
        .map((parentDistance, index) => ({ parentDistance, angle: adjustAngle(index * letterAngle) }));
};

export const calculateInitialNestedVocalPositionData = (
    vocalPlacement: VocalPlacement,
    parentConsonantPlacement: ConsonantPlacement,
    consonantPositionData: PositionData,
    wordRadius: number
): PositionData => {
    switch (vocalPlacement) {
        case VocalPlacement.OnLine:
            if (parentConsonantPlacement === ConsonantPlacement.ShallowCut) {
                return {
                    angle: 0,
                    parentDistance: wordRadius - consonantPositionData.parentDistance,
                };
            } else {
                return {
                    angle: 0,
                    parentDistance: 0,
                };
            }
        case VocalPlacement.Outside:
            return {
                angle: 0,
                parentDistance: wordRadius - consonantPositionData.parentDistance + DEFAULT_VOCAL_RADIUS + 5,
            };
        case VocalPlacement.Inside:
            return {
                angle: 180,
                parentDistance: DEFAULT_CONSONANT_RADIUS,
            };
    }
};

export const calculateInitialDotPositionDatas = (letterRadius: number, numberOfDots: number): PositionData[] => {
    const letterSideAngle = 180;
    const dotDistanceAngle = 45;
    const centerDotsOnLetterSideAngle = ((numberOfDots - 1) * dotDistanceAngle) / 2;

    return range(numberOfDots).map((i) => ({
        parentDistance: letterRadius - 10,
        angle: adjustAngle(i * dotDistanceAngle - centerDotsOnLetterSideAngle + letterSideAngle),
    }));
};

export const calculateInitialLineSlotPositionDatas = (
    letterRadius: number,
    numberOfLines: number,
    pointOutside: boolean
): PositionData[] => {
    const letterSideAngle = pointOutside ? 0 : 180;
    const lineDistanceAngle = 45;
    const centerLinesOnLetterSideAngle = ((numberOfLines - 1) * lineDistanceAngle) / 2;

    return range(numberOfLines).map((i) => ({
        parentDistance: letterRadius,
        angle: adjustAngle(i * lineDistanceAngle - centerLinesOnLetterSideAngle + letterSideAngle),
    }));
};

export const resetPositionDatas = (state: ImageState) => resetSentencePositionData(state, state.sentence);

export const resetSentencePositionData = (state: ImageState, sentence: Sentence) => {
    const sentenceCircle = state.circles[sentence.circleId];

    zipEqual(sentence.words, calculateInitialWordPositionDatas(sentenceCircle.r, sentence.words.length)).forEach(
        ([word, wordPositionData]) => {
            resetWordPositionData(state, word, wordPositionData);
        }
    );
};

export const resetWordPositionData = (state: ImageState, word: Word, wordPositionData: PositionData) => {
    const wordCircle = state.circles[word.circleId];

    wordCircle.angle = wordPositionData.angle;
    wordCircle.parentDistance = wordPositionData.parentDistance;

    zipEqual(word.letters, calculateInitialLetterPositionDatas(word.letters, wordCircle.r)).forEach(
        ([letter, letterPositionData]) => {
            resetLetterPositionData(state, letter, letterPositionData, wordCircle.r);
        }
    );
};

const resetLetterPositionData = (
    state: ImageState,
    letter: Letter,
    letterPositionData: PositionData,
    wordRadius: number
) => {
    if (isLetterConsonant(letter)) {
        resetConsonantPositionData(state, letter, letterPositionData, wordRadius);
    } else {
        resetVocalPositionData(state, letter, letterPositionData);
    }
};

const resetVocalPositionData = (state: ImageState, vocal: Vocal, vocalPositionData: PositionData) => {
    const vocalCircle = state.circles[vocal.circleId];

    vocalCircle.angle = vocalPositionData.angle;
    vocalCircle.parentDistance = vocalPositionData.parentDistance;

    const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
        vocalCircle.r,
        vocal.lineSlots.length,
        vocal.decoration === VocalDecoration.LineOutside
    );

    zipEqual(
        vocal.lineSlots.map((slot) => state.lineSlots[slot]),
        lineSlotPositionDatas
    ).forEach(([slot, lineSlotPositionData]) => {
        slot.angle = lineSlotPositionData.angle;
        slot.parentDistance = lineSlotPositionData.parentDistance;
    });
};

const resetConsonantPositionData = (
    state: ImageState,
    consonant: Consonant,
    consonantPositionData: PositionData,
    wordRadius: number
) => {
    const consonantCircle = state.circles[consonant.circleId];

    consonantCircle.angle = consonantPositionData.angle;
    consonantCircle.parentDistance = consonantPositionData.parentDistance;

    const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
        consonantCircle.r,
        consonant.lineSlots.length,
        false
    );

    zipEqual(
        consonant.lineSlots.map((slot) => state.lineSlots[slot]),
        lineSlotPositionDatas
    ).forEach(([slot, lineSlotPositionData]) => {
        slot.angle = lineSlotPositionData.angle;
        slot.parentDistance = lineSlotPositionData.parentDistance;
    });

    const dotPositionDatas = calculateInitialDotPositionDatas(consonantCircle.r, consonant.dots.length);

    consonant.dots.forEach((dot, index) => {
        const dotCircle = state.circles[dot];
        const { angle: dotAngle, parentDistance: dotParentDistance } = dotPositionDatas[index];
        dotCircle.angle = dotAngle;
        dotCircle.parentDistance = dotParentDistance;
    });

    Maybe.of(consonant.vocal).ifIsSome((vocal) => {
        const vocalPositionData = calculateInitialNestedVocalPositionData(
            vocal.placement,
            consonant.placement,
            consonantPositionData,
            wordRadius
        );
        resetVocalPositionData(state, vocal, vocalPositionData);
    });
};
