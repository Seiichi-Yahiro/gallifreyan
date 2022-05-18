import { range, zip } from 'lodash';
import { ImageState } from '../state/ImageState';
import {
    CircleData,
    Consonant,
    ConsonantPlacement,
    Letter,
    LineSlotData,
    Sentence,
    Vocal,
    VocalDecoration,
    VocalPlacement,
    Word,
} from '../state/ImageTypes';
import { isLetterConsonant, isLetterVocal } from './LetterGroups';
import { Degree, rotate, toRadian, Vector2 } from './LinearAlgebra';
import Maybe from './Maybe';

const zipEqual: <T1, T2>(array1: T1[], array2: T2[]) => [T1, T2][] = zip;

export const adjustAngle = (angle: Degree): Degree => ((angle % 360) + 360) % 360;

export const calculateTranslation = (angle: number, distance: number): Vector2 =>
    rotate({ x: 0, y: distance }, toRadian(-angle));

export const calculateInitialWordCircleData = (sentenceRadius: number, numberOfWords: number): CircleData[] => {
    const wordAngle = 360 / numberOfWords;
    const r = (sentenceRadius * 0.75) / (1 + numberOfWords / 2);
    const distance = numberOfWords > 1 ? sentenceRadius - r * 1.5 : 0;

    return range(numberOfWords).map((i) => ({
        angle: adjustAngle(i * wordAngle),
        distance,
        r,
    }));
};

export const calculateInitialLetterCircleDatas = (letters: Letter[], wordRadius: number): CircleData[] => {
    const letterAngle = 360 / letters.length;

    return letters.map((letter, i) => {
        const angle = adjustAngle(i * letterAngle);
        const r = isLetterVocal(letter)
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
    consonantCircleData: CircleData,
    wordRadius: number
): CircleData => {
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

export const calculateInitialDotCircleDatas = (letterRadius: number, numberOfDots: number): CircleData[] => {
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

export const calculateInitialLineSlotDatas = (
    letterRadius: number,
    numberOfLines: number,
    pointOutside: boolean
): LineSlotData[] => {
    const letterSideAngle = pointOutside ? 0 : 180;
    const lineDistanceAngle = 45;
    const centerLinesOnLetterSideAngle = ((numberOfLines - 1) * lineDistanceAngle) / 2;

    return range(numberOfLines).map((i) => ({
        distance: letterRadius,
        angle: adjustAngle(i * lineDistanceAngle - centerLinesOnLetterSideAngle + letterSideAngle),
    }));
};

export const resetCircleDatas = (state: ImageState) => resetSentenceCircleData(state, state.sentence);

export const resetSentenceCircleData = (state: ImageState, sentence: Sentence) => {
    const sentenceCircle = state.circles[sentence.circleId];

    zipEqual(sentence.words, calculateInitialWordCircleData(sentenceCircle.r, sentence.words.length)).forEach(
        ([word, wordCircleData]) => {
            resetWordCircleData(state, word, wordCircleData);
        }
    );
};

export const resetWordCircleData = (state: ImageState, word: Word, wordCircleData: CircleData) => {
    const wordCircle = state.circles[word.circleId];

    wordCircle.angle = wordCircleData.angle;
    wordCircle.distance = wordCircleData.distance;
    wordCircle.r = wordCircleData.r;

    zipEqual(word.letters, calculateInitialLetterCircleDatas(word.letters, wordCircle.r)).forEach(
        ([letter, letterCircleData]) => {
            resetLetterCircleData(state, letter, letterCircleData, wordCircle.r);
        }
    );
};

const resetLetterCircleData = (state: ImageState, letter: Letter, letterCircleData: CircleData, wordRadius: number) => {
    if (isLetterConsonant(letter)) {
        resetConsonantCircleData(state, letter, letterCircleData, wordRadius);
    } else {
        resetVocalCircleData(state, letter, letterCircleData);
    }
};

const resetVocalCircleData = (state: ImageState, vocal: Vocal, vocalCircleData: CircleData) => {
    const vocalCircle = state.circles[vocal.circleId];

    vocalCircle.angle = vocalCircleData.angle;
    vocalCircle.distance = vocalCircleData.distance;
    vocalCircle.r = vocalCircleData.r;

    const lineSlotDatas = calculateInitialLineSlotDatas(
        vocalCircle.r,
        vocal.lineSlots.length,
        vocal.decoration === VocalDecoration.LineOutside
    );

    zipEqual(
        vocal.lineSlots.map((slot) => state.lineSlots[slot]),
        lineSlotDatas
    ).forEach(([slot, lineSlotData]) => {
        slot.angle = lineSlotData.angle;
        slot.distance = lineSlotData.distance;
    });
};

const resetConsonantCircleData = (
    state: ImageState,
    consonant: Consonant,
    consonantCircleData: CircleData,
    wordRadius: number
) => {
    const consonantCircle = state.circles[consonant.circleId];

    consonantCircle.angle = consonantCircleData.angle;
    consonantCircle.distance = consonantCircleData.distance;
    consonantCircle.r = consonantCircleData.r;

    const lineSlotDatas = calculateInitialLineSlotDatas(consonantCircle.r, consonant.lineSlots.length, false);

    zipEqual(
        consonant.lineSlots.map((slot) => state.lineSlots[slot]),
        lineSlotDatas
    ).forEach(([slot, lineSlotData]) => {
        slot.angle = lineSlotData.angle;
        slot.distance = lineSlotData.distance;
    });

    const dotCircleDatas = calculateInitialDotCircleDatas(consonantCircle.r, consonant.dots.length);

    consonant.dots.forEach((dot, index) => {
        const dotCircle = state.circles[dot];
        const dotCircleData = dotCircleDatas[index];
        dotCircle.angle = dotCircleData.angle;
        dotCircle.distance = dotCircleData.distance;
        dotCircle.r = dotCircleData.r;
    });

    Maybe.of(consonant.vocal).ifIsSome((vocal) => {
        const vocalCircleData = calculateInitialNestedVocalCircleData(
            vocal.placement,
            consonant.placement,
            consonantCircleData,
            wordRadius
        );
        resetVocalCircleData(state, vocal, vocalCircleData);
    });
};
