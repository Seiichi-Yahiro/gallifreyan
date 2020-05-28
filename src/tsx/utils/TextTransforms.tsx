import { AppStoreState, Letter, PositionData } from '../state/StateTypes';
import { range } from 'lodash';
import {
    isDeepCut,
    isInside,
    isLetterConsonant,
    isShallowCut,
    isVocalInside,
    isVocalLineOutside,
    isVocalOutside,
} from './LetterGroups';
import { DEFAULT_CONSONANT_RADIUS, DEFAULT_VOCAL_RADIUS } from './TextDefaultValues';

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
            if (isDeepCut(letter.text)) {
                return wordRadius - (DEFAULT_CONSONANT_RADIUS / 2) * 1.25;
            } else if (isShallowCut(letter.text)) {
                return wordRadius + DEFAULT_CONSONANT_RADIUS / 2;
            } else if (isInside(letter.text)) {
                return wordRadius - (DEFAULT_CONSONANT_RADIUS / 2) * 2 - 5;
            } else if (isVocalOutside(letter.text)) {
                return wordRadius + DEFAULT_VOCAL_RADIUS + 5;
            } else if (isVocalInside(letter.text)) {
                return wordRadius - DEFAULT_VOCAL_RADIUS - 5;
            } else {
                return wordRadius;
            }
        })
        .map((parentDistance, index) => ({ parentDistance, angle: index * letterAngle }));
};

export const calculateInitialNestedVocalPositionData = (
    vocal: string,
    parentConsonant: string,
    consonantPositionData: PositionData,
    wordRadius: number
): PositionData => {
    if (isVocalOutside(vocal)) {
        const angle = consonantPositionData.angle;
        const parentDistance = wordRadius + DEFAULT_VOCAL_RADIUS + 5;
        return { angle, parentDistance };
    } else if (isVocalInside(vocal)) {
        const data = { ...consonantPositionData };
        data.parentDistance -= DEFAULT_CONSONANT_RADIUS;
        return data;
    } else if (isShallowCut(parentConsonant)) {
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

export const resetLetters = (state: AppStoreState) => {
    state.sentences.forEach((sentence) => {
        const sentenceCircle = state.circles[sentence.circleId];

        const wordPositionDatas = calculateInitialWordPositionDatas(sentenceCircle.r, sentence.words.length);

        sentence.words.forEach((word, index) => {
            const wordCircle = state.circles[word.circleId];

            const { angle: wordAngle, parentDistance: wordParentDistance } = wordPositionDatas[index];
            wordCircle.angle = wordAngle;
            wordCircle.parentDistance = wordParentDistance;

            const letterPositionDatas = calculateInitialLetterPositionDatas(word.letters, wordCircle.r);

            word.letters.forEach((letter, index) => {
                const letterCircle = state.circles[letter.circleId];

                const { angle: letterAngle, parentDistance: letterParentDistance } = letterPositionDatas[index];
                letterCircle.angle = letterAngle;
                letterCircle.parentDistance = letterParentDistance;

                if (isLetterConsonant(letter)) {
                    letter.vocal.ifIsSome((vocal) => {
                        const vocalCircle = state.circles[vocal.circleId];
                        const {
                            angle: vocalAngle,
                            parentDistance: vocalParentDistance,
                        } = calculateInitialNestedVocalPositionData(
                            vocal.text,
                            letter.text,
                            letterPositionDatas[index],
                            wordCircle.r
                        );
                        vocalCircle.angle = vocalAngle;
                        vocalCircle.parentDistance = vocalParentDistance;

                        const vocalLineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
                            vocalCircle.r,
                            letterAngle,
                            vocal.lineSlots.length,
                            isVocalLineOutside(vocal.text)
                        );

                        vocal.lineSlots
                            .map((slot) => state.lineSlots[slot])
                            .forEach((slot, index) => {
                                const {
                                    angle: slotAngle,
                                    parentDistance: slotParentDistance,
                                } = vocalLineSlotPositionDatas[index];
                                slot.angle = slotAngle;
                                slot.parentDistance = slotParentDistance;
                            });
                    });
                }

                const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
                    letterCircle.r,
                    letterAngle,
                    letter.lineSlots.length,
                    isVocalLineOutside(letter.text)
                );

                letter.lineSlots
                    .map((slot) => state.lineSlots[slot])
                    .forEach((slot, index) => {
                        const { angle: slotAngle, parentDistance: slotParentDistance } = lineSlotPositionDatas[index];
                        slot.angle = slotAngle;
                        slot.parentDistance = slotParentDistance;
                    });

                if (isLetterConsonant(letter)) {
                    const dotPositionDatas = calculateInitialDotPositionDatas(
                        letterCircle.r,
                        letterAngle,
                        letter.dots.length
                    );

                    letter.dots.forEach((dot, index) => {
                        const dotCircle = state.circles[dot];
                        const { angle: dotAngle, parentDistance: dotParentDistance } = dotPositionDatas[index];
                        dotCircle.angle = dotAngle;
                        dotCircle.parentDistance = dotParentDistance;
                    });
                }
            });
        });
    });
};
