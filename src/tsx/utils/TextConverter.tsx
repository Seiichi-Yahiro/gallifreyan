import { v4 } from 'uuid';
import { Letter, Circle, UUID, LineSlot, Sentence, Word, Vocal, Consonant } from '../state/StateTypes';
import {
    DOUBLE_LETTER,
    isDoubleDot,
    isDoubleLine,
    isSingleLine,
    isTripleDot,
    isTripleLine,
    isVocal,
    isVocalSingleLine,
} from './LetterGroups';
import Maybe from './Maybe';
import { range } from 'lodash';
import {
    DefaultConsonantRadius,
    DefaultSentenceRadius,
    DefaultVocalRadius,
    DefaultWordRadius,
} from './TextDefaultValues';

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
        r: DefaultSentenceRadius,
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
        r: DefaultWordRadius,
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
        r: isVocal(text) ? DefaultVocalRadius : DefaultConsonantRadius,
        filled: false,
    };

    const lineSlots = createLineSlots(letterCircle.id, text);

    const letter: Letter = {
        text,
        circleId: letterCircle.id,
        lineSlots: lineSlots.map((slot) => slot.id),
    };

    if (isVocal(text)) {
        const vocal: Vocal = {
            ...letter,
            isAttachedToConsonant: false, // TODO set to true
        };

        return {
            letter: vocal,
            circles: [letterCircle],
            lineSlots,
        };
    } else {
        const dots = createDots(letterCircle.id, text);

        const consonant: Consonant = {
            ...letter,
            dots: dots.map((dot) => dot.id),
        };

        return {
            letter: consonant,
            circles: dots.concat(letterCircle),
            lineSlots,
        };
    }
};

const createDots = (letterId: UUID, char: string): Circle[] => {
    let numberOfDots = 0;

    if (isDoubleDot(char)) {
        numberOfDots = 2;
    } else if (isTripleDot(char)) {
        numberOfDots = 3;
    }

    return range(numberOfDots).map((_i) => ({
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: 5,
        filled: true,
    }));
};

const createLineSlots = (letterId: UUID, char: string): LineSlot[] => {
    let numberOfLineSlots = 0;

    if (isSingleLine(char) || isVocalSingleLine(char)) {
        numberOfLineSlots = 1;
    } else if (isDoubleLine(char)) {
        numberOfLineSlots = 2;
    } else if (isTripleLine(char)) {
        numberOfLineSlots = 3;
    }

    return range(numberOfLineSlots).map((_i) => ({
        id: v4(),
        angle: 0,
        parentDistance: 0,
        connection: Maybe.none(),
    }));
};
