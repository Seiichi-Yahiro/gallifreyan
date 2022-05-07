import { range, zip } from 'lodash';
import { ImageStore } from '../state/ImageStore';
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
import { DEFAULT_CONSONANT_RADIUS, DEFAULT_VOCAL_RADIUS } from './TextDefaultValues';

const zipEqual: <T1, T2>(array1: T1[], array2: T2[]) => [T1, T2][] = zip;

const toRadian = (degree: number) => degree * (Math.PI / 180);

const rotate = (x: number, y: number, angle: number): { x: number; y: number } => {
    const radian = toRadian(angle);
    const cosAngle = Math.cos(radian);
    const sinAngle = Math.sin(radian);

    const rotatedX = x * cosAngle - y * sinAngle;
    const rotatedY = x * sinAngle + y * cosAngle;

    return { x: rotatedX, y: rotatedY };
};

export const calculateTranslation = (angle: number, parentDistance: number) => rotate(0, parentDistance, angle);

export const calculateInitialWordPositionDatas = (sentenceRadius: number, numberOfWords: number): PositionData[] => {
    const wordAngle = -360 / numberOfWords;
    return range(numberOfWords).map((i) => ({ angle: i * wordAngle, parentDistance: sentenceRadius - 150 }));
};

export const calculateInitialLetterPositionDatas = (letters: Letter[], wordRadius: number): PositionData[] => {
    const letterAngle = -360 / letters.length;

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
        .map((parentDistance, index) => ({ parentDistance, angle: index * letterAngle }));
};

export const calculateInitialNestedVocalPositionData = (
    vocalPlacement: VocalPlacement,
    parentConsonantPlacement: ConsonantPlacement,
    consonantPositionData: PositionData,
    wordRadius: number
): PositionData => {
    if (vocalPlacement === VocalPlacement.Outside) {
        const angle = consonantPositionData.angle;
        const parentDistance = wordRadius + DEFAULT_VOCAL_RADIUS + 5;
        return { angle, parentDistance };
    } else if (vocalPlacement === VocalPlacement.Inside) {
        const data = { ...consonantPositionData };
        data.parentDistance -= DEFAULT_CONSONANT_RADIUS;
        return data;
    } else if (parentConsonantPlacement === ConsonantPlacement.ShallowCut) {
        const angle = consonantPositionData.angle;
        const parentDistance = wordRadius;
        return { angle, parentDistance };
    } else {
        return { ...consonantPositionData };
    }
};

export const calculateInitialDotPositionDatas = (
    letterRadius: number,
    letterAngle: number,
    numberOfDots: number
): PositionData[] => {
    const letterSideAngle = letterAngle - 180;
    const dotDistanceAngle = -45;
    const centerDotsOnLetterSideAngle = ((numberOfDots - 1) * dotDistanceAngle) / 2;

    return range(numberOfDots).map((i) => ({
        parentDistance: letterRadius - 10,
        angle: i * dotDistanceAngle - centerDotsOnLetterSideAngle + letterSideAngle,
    }));
};

export const calculateInitialLineSlotPositionDatas = (
    letterRadius: number,
    letterAngle: number,
    numberOfLines: number,
    pointOutside: boolean
): PositionData[] => {
    const letterSideAngle = letterAngle - (pointOutside ? 0 : 180);
    const lineDistanceAngle = -45;
    const centerLinesOnLetterSideAngle = ((numberOfLines - 1) * lineDistanceAngle) / 2;

    return range(numberOfLines).map((i) => ({
        parentDistance: letterRadius,
        angle: i * lineDistanceAngle - centerLinesOnLetterSideAngle + letterSideAngle,
    }));
};

export const resetPositionDatas = (state: ImageStore) => resetSentencePositionData(state, state.sentence);

export const resetSentencePositionData = (state: ImageStore, sentence: Sentence) => {
    const sentenceCircle = state.circles[sentence.circleId];

    zipEqual(sentence.words, calculateInitialWordPositionDatas(sentenceCircle.r, sentence.words.length)).forEach(
        ([word, wordPositionData]) => {
            resetWordPositionData(state, word, wordPositionData);
        }
    );
};

export const resetWordPositionData = (state: ImageStore, word: Word, wordPositionData: PositionData) => {
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
    state: ImageStore,
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

const resetVocalPositionData = (state: ImageStore, vocal: Vocal, vocalPositionData: PositionData) => {
    const vocalCircle = state.circles[vocal.circleId];

    vocalCircle.angle = vocalPositionData.angle;
    vocalCircle.parentDistance = vocalPositionData.parentDistance;

    const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
        vocalCircle.r,
        vocalPositionData.angle,
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
    state: ImageStore,
    consonant: Consonant,
    consonantPositionData: PositionData,
    wordRadius: number
) => {
    const consonantCircle = state.circles[consonant.circleId];

    consonantCircle.angle = consonantPositionData.angle;
    consonantCircle.parentDistance = consonantPositionData.parentDistance;

    const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
        consonantCircle.r,
        consonantPositionData.angle,
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

    const dotPositionDatas = calculateInitialDotPositionDatas(
        consonantCircle.r,
        consonantPositionData.angle,
        consonant.dots.length
    );

    consonant.dots.forEach((dot, index) => {
        const dotCircle = state.circles[dot];
        const { angle: dotAngle, parentDistance: dotParentDistance } = dotPositionDatas[index];
        dotCircle.angle = dotAngle;
        dotCircle.parentDistance = dotParentDistance;
    });

    consonant.vocal.ifIsSome((vocal) => {
        const vocalPositionData = calculateInitialNestedVocalPositionData(
            vocal.placement,
            consonant.placement,
            consonantPositionData,
            wordRadius
        );
        resetVocalPositionData(state, vocal, vocalPositionData);
    });
};
