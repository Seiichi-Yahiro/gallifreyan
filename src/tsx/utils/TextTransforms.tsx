import { AppStoreState, PositionData } from '../state/StateTypes';
import { range } from 'lodash';
import { isDeepCut, isInside, isShallowCut } from './LetterGroups';

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
    const letterAngle = -360 / letterTexts.length;

    return letterTexts
        .map((letter) => {
            if (isDeepCut(letter)) {
                return wordRadius - 25 * 1.25;
            } else if (isShallowCut(letter)) {
                return wordRadius + 25;
            } else if (isInside(letter)) {
                return wordRadius - 25 * 2 - 5;
            } else {
                return wordRadius;
            }
        })
        .map((parentDistance, index) => ({ angle: letterAngle * index, parentDistance }));
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
            const letterAngle = -360 / word.letters.length;

            const { angle, parentDistance } = wordPositionDatas[index];
            wordCircle.angle = angle;
            wordCircle.parentDistance = parentDistance;

            const letterPositionDatas = calculateInitialLetterPositionDatas(
                word.letters.map((it) => it.text),
                wordCircle.r
            );

            word.letters.forEach((letter, index) => {
                const letterCircle = state.circles[letter.circleId];

                const { angle, parentDistance } = letterPositionDatas[index];
                letterCircle.angle = angle;
                letterCircle.parentDistance = parentDistance;

                const lineSlotPositionDatas = calculateInitialLineSlotPositionDatas(
                    letterCircle.r,
                    letterAngle * index,
                    letter.lineSlots.length
                );

                letter.lineSlots
                    .map((slot) => state.lineSlots[slot])
                    .forEach((slot, index) => {
                        const { angle, parentDistance } = lineSlotPositionDatas[index];
                        slot.angle = angle;
                        slot.parentDistance = parentDistance;
                    });

                const dotPositionDatas = calculateInitialDotPositionDatas(
                    letterCircle.r,
                    letterAngle * index,
                    letter.dots.length
                );

                letter.dots.forEach((dot, index) => {
                    const dotCircle = state.circles[dot];
                    const { angle, parentDistance } = dotPositionDatas[index];
                    dotCircle.angle = angle;
                    dotCircle.parentDistance = parentDistance;
                });
            });
        });
    });
};
