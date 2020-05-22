import { v4 } from 'uuid';
import { Letter, Circle, UUID, LineSlot, Sentence, Word } from '../state/StateTypes';
import {
    DOUBLE_LETTER,
    isDoubleDot,
    isDoubleLine,
    isSingleLine,
    isTripleDot,
    isTripleLine,
    isVocal,
} from './LetterGroups';
import Maybe from './Maybe';
import { range } from 'lodash';

export const splitWordToChars = (word: string): string[] => {
    const index = word.search(DOUBLE_LETTER);

    if (index === -1) {
        return word.split('');
    } else {
        const firstPart = word.slice(0, index);
        const found = word.slice(index, index + 2);
        const lastPart = word.slice(index + 2);

        return firstPart.split('').concat(found).concat(splitWordToChars(lastPart));
    }
};

export const convertTextToSentence = (
    text: string
): { sentence: Sentence; circles: Circle[]; lineSlots: LineSlot[] } => {
    const sentenceCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: 450,
        filled: false,
    };

    const wordData = text.split(' ').map((word) => convertTextToWord(word));

    const sentence: Sentence = {
        text,
        circleId: sentenceCircle.id,
        words: wordData.map((it) => it.word),
        lineSlots: [],
    };

    return {
        sentence,
        circles: wordData.flatMap((it) => it.circles).concat(sentenceCircle),
        lineSlots: wordData.flatMap((it) => it.lineSlots),
    };
};

const convertTextToWord = (text: string): { word: Word; circles: Circle[]; lineSlots: LineSlot[] } => {
    const wordCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: 100,
        filled: false,
    };

    const letterData = splitWordToChars(text).map((char) => convertTextToLetter(char));

    const word: Word = {
        text,
        circleId: wordCircle.id,
        letters: letterData.map((it) => it.letter),
        lineSlots: [],
    };

    return {
        word,
        circles: letterData.flatMap((it) => it.circles).concat(wordCircle),
        lineSlots: letterData.flatMap((it) => it.lineSlots),
    };
};

const convertTextToLetter = (text: string): { letter: Letter; circles: Circle[]; lineSlots: LineSlot[] } => {
    const letterCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: isVocal(text) ? 20 : 50,
        filled: false,
    };

    const dots = createDots(letterCircle.id, text);
    const lineSlots = createLineSlots(letterCircle.id, text);

    const letter: Letter = {
        text,
        circleId: letterCircle.id,
        dots: dots.map((dot) => dot.id),
        lineSlots: lineSlots.map((slot) => slot.id),
    };

    return {
        letter,
        circles: dots.concat(letterCircle),
        lineSlots,
    };
};

const createDots = (letterId: UUID, char: string): Circle[] => {
    let dots: Circle[] = [];
    let numberOfDots = 0;

    if (isDoubleDot(char)) {
        numberOfDots = 2;
    } else if (isTripleDot(char)) {
        numberOfDots = 3;
    }

    for (const _ of range(numberOfDots)) {
        dots.push({
            id: v4(),
            angle: 0,
            parentDistance: 0,
            r: 5,
            filled: true,
        });
    }

    return dots;
};

const createLineSlots = (letterId: UUID, char: string): LineSlot[] => {
    let lineSlots: LineSlot[] = [];
    let numberOfLineSlots = 0;

    if (isSingleLine(char)) {
        numberOfLineSlots = 1;
    } else if (isDoubleLine(char)) {
        numberOfLineSlots = 2;
    } else if (isTripleLine(char)) {
        numberOfLineSlots = 3;
    }

    for (const _ of range(numberOfLineSlots)) {
        lineSlots.push({
            id: v4(),
            angle: 0,
            parentDistance: 0,
            connection: Maybe.none(),
        });
    }

    return lineSlots;
};
