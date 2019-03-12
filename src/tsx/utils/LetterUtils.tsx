import { ILetter, IWord, SVGItemType } from '../types/SVG';
import {
    DOUBLE_LETTER,
    isDeepCut,
    isEmpty,
    isInside,
    isOnLine,
    isShallowCut,
    isValidLetter,
    isVocal,
    letterGroupsCombination
} from './LetterGroups';
import Point from './Point';
import { v4 } from 'uuid';
import * as _ from 'lodash';

const splitWordToLetters = (word: string): string[] => {
    const index = word.search(DOUBLE_LETTER);

    if (index === -1) {
        return word.split('');
    } else {
        const firstPart = word.slice(0, index);
        const found = word.slice(index, index + 2);
        const lastPart = word.slice(index + 2);

        return firstPart
            .split('')
            .concat(found)
            .concat(splitWordToLetters(lastPart));
    }
};

const filterValidLetters = (letters: string[]) => letters.filter(isValidLetter);

const initializeLettersPosition = (letters: string[], parent: IWord): ILetter[] =>
    letters.map((letter: string, index: number) => {
        const previousLetter = index !== 0 ? letters[index - 1] : '';
        const initialPoint = initializeLetterPosition(letter, previousLetter, parent.r);

        return {
            ...initialPoint,
            id: v4(),
            type: SVGItemType.LETTER,
            parent,
            r: isVocal(letter) ? 10 : 25,
            text: letter,
            angles: [],
            children: []
        } as ILetter;
    });

const initializeLetterPosition = (letter: string, previousLetter: string, wordRadius: number): Point => {
    switch (true) {
        case isVocal(letter): {
            return initializeVocalPosition(letter, previousLetter, wordRadius);
        }

        case isDeepCut(letter): {
            return new Point(0, wordRadius - 25 * 0.75);
        }

        case isInside(letter): {
            return new Point(0, wordRadius - 25 - 5);
        }

        case isShallowCut(letter):
        case isOnLine(letter):
        default: {
            return new Point(0, wordRadius);
        }
    }
};

const initializeVocalPosition = (vocal: string, previousLetter: string, wordRadius: number): Point => {
    switch (true) {
        case RegExp('a', 'i').test(vocal): {
            return new Point(0, wordRadius + 10 + 5); // TODO is on line ?
        }

        case RegExp('o', 'i').test(vocal): {
            if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                return new Point(0, wordRadius - 10 - 5);
            } else {
                const previousLetterPosition = initializeLetterPosition(previousLetter, '', wordRadius);
                return previousLetterPosition.subtract(new Point(0, 25));
            }
        }

        case RegExp(/[eiu]/, 'i').test(vocal):
        default: {
            if (letterGroupsCombination(isEmpty, isVocal)(previousLetter)) {
                return new Point(0, wordRadius);
            } else {
                return initializeLetterPosition(previousLetter, '', wordRadius);
            }
        }
    }
};

const initializeLettersRotation = (letters: ILetter[]): ILetter[] => {
    const newLetters = [...letters];
    const radians =
        -(Math.PI * 2) /
        newLetters
            .map(l => l.text)
            .map(isVocal)
            .filter((vocal, index, array) => !(index !== 0 && vocal && !array[index - 1])).length;

    let rotationIndex = 0;

    for (let i = 0; i < newLetters.length; i++) {
        const { text: letter, x, y } = newLetters[i];
        const previousLetter = i !== 0 ? newLetters[i - 1].text : '';

        if (isVocal(letter) && !letterGroupsCombination(isVocal, isEmpty)(previousLetter)) {
            rotationIndex = rotationIndex > 0 ? rotationIndex - 1 : 0;
        }

        newLetters[i] = {
            ...newLetters[i],
            ...new Point(x, y).rotate(radians * rotationIndex)
        };

        rotationIndex++;
    }

    return newLetters;
};

export const initializeLetters = (word: IWord) =>
    _.flow(
        splitWordToLetters,
        filterValidLetters,
        _.partial(initializeLettersPosition, _, word),
        initializeLettersRotation
    )(word.text);
