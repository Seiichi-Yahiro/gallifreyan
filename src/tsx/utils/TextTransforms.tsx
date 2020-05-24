import { AppStoreState, PositionData } from '../state/StateTypes';
import { range } from 'lodash';
import {
    isConsonant,
    isDeepCut,
    isInside,
    isLetterConsonant,
    isShallowCut,
    isVocal,
    isVocalInside,
    isVocalOutside,
} from './LetterGroups';
import { DefaultConsonantRadius, DefaultVocalRadius } from './TextDefaultValues';

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

export const calculateInitialLetterPositionDatas = (letterTexts: string[], wordRadius: number): PositionData[] => {
    const positionData: PositionData[] = [];

    let offset = 0;

    for (let i = 0; i < letterTexts.length; i++) {
        const letter = letterTexts[i];

        let parentDistance: number;

        if (isVocal(letter)) {
            const prevLetter = letterTexts[i - 1] ?? '';

            if (isConsonant(prevLetter)) {
                offset++;

                if (isVocalOutside(letter)) {
                    const angle = positionData[i - 1].angle;
                    const parentDistance = wordRadius + DefaultVocalRadius + 5;
                    positionData.push({ angle, parentDistance });
                } else if (isVocalInside(letter)) {
                    const data = { ...positionData[i - 1] };
                    data.parentDistance -= DefaultConsonantRadius;
                    positionData.push(data);
                } else {
                    if (isShallowCut(prevLetter)) {
                        const angle = positionData[i - 1].angle;
                        const parentDistance = wordRadius;
                        positionData.push({ angle, parentDistance });
                    } else {
                        positionData.push({ ...positionData[i - 1] });
                    }
                }

                continue;
            }
        }

        if (isDeepCut(letter)) {
            parentDistance = wordRadius - (DefaultConsonantRadius / 2) * 1.25;
        } else if (isShallowCut(letter)) {
            parentDistance = wordRadius + DefaultConsonantRadius / 2;
        } else if (isInside(letter)) {
            parentDistance = wordRadius - (DefaultConsonantRadius / 2) * 2 - 5;
        } else if (isVocalOutside(letter)) {
            parentDistance = wordRadius + DefaultVocalRadius + 5;
        } else if (isVocalInside(letter)) {
            parentDistance = wordRadius - DefaultVocalRadius - 5;
        } else {
            parentDistance = wordRadius;
        }

        positionData.push({ parentDistance, angle: i - offset });
    }

    const letterAngle = -360 / (positionData[positionData.length - 1].angle + 1);
    positionData.forEach((data) => (data.angle *= letterAngle));

    return positionData;
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
    numberOfLines: number
): PositionData[] => {
    const letterSideAngle = letterAngle - 180;
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

            const letterPositionDatas = calculateInitialLetterPositionDatas(
                word.letters.map((it) => it.text),
                wordCircle.r
            );

            word.letters.forEach((letter, index) => {
                const letterCircle = state.circles[letter.circleId];

                const { angle: letterAngle, parentDistance: letterParentDistance } = letterPositionDatas[index];
                letterCircle.angle = letterAngle;
                letterCircle.parentDistance = letterParentDistance;

                const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
                    letterCircle.r,
                    letterAngle,
                    letter.lineSlots.length
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
