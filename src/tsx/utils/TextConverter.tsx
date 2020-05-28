import { v4 } from 'uuid';
import { Letter, Circle, UUID, LineSlot, Sentence, Word, Vocal, Consonant } from '../state/StateTypes';
import {
    DOUBLE_LETTER,
    isDoubleDot,
    isDoubleLine,
    isLetterConsonant,
    isLetterVocal,
    isSingleLine,
    isTripleDot,
    isTripleLine,
    isVocal,
    isVocalSingleLine,
} from './LetterGroups';
import Maybe from './Maybe';
import { range, last } from 'lodash';
import {
    DEFAULT_CONSONANT_RADIUS,
    DEFAULT_SENTENCE_RADIUS,
    DEFAULT_VOCAL_RADIUS,
    DEFAULT_WORD_RADIUS,
} from './TextDefaultValues';

interface TextData<T> {
    textPart: T;
    circles: Circle[];
    lineSlots: LineSlot[];
}

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

export const convertTextToSentence = (text: string): TextData<Sentence> => {
    const sentenceCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: DEFAULT_SENTENCE_RADIUS,
        filled: false,
    };

    const wordData = text.split(' ').map((word) => convertTextToWord(word));

    const sentence: Sentence = {
        text,
        circleId: sentenceCircle.id,
        words: wordData.map((it) => it.textPart),
        lineSlots: [],
    };

    return {
        textPart: sentence,
        circles: wordData.flatMap((it) => it.circles).concat(sentenceCircle),
        lineSlots: wordData.flatMap((it) => it.lineSlots),
    };
};

const convertTextToWord = (text: string): TextData<Word> => {
    const wordCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: DEFAULT_WORD_RADIUS,
        filled: false,
    };

    const letterData = splitWordToChars(text)
        .map(convertTextToLetter)
        .reduce<TextData<Letter>[]>((acc, textData) => {
            const prevTextData = Maybe.of(last(acc));
            const isPrevConsonantWithoutNestedVocal = prevTextData
                .map((it) => isLetterConsonant(it.textPart) && it.textPart.vocal.isNone())
                .unwrapOr(false);

            if (isPrevConsonantWithoutNestedVocal && isLetterVocal(textData.textPart)) {
                const consonant = prevTextData.unwrap() as TextData<Consonant>;
                consonant.textPart.vocal = Maybe.some(textData.textPart);
                consonant.circles = consonant.circles.concat(textData.circles);
                consonant.lineSlots = consonant.lineSlots.concat(textData.lineSlots);
                return acc.slice(0, acc.length - 1).concat(consonant);
            } else {
                return acc.concat(textData);
            }
        }, []);

    const word: Word = {
        text,
        circleId: wordCircle.id,
        letters: letterData.map((it) => it.textPart),
        lineSlots: [],
    };

    return {
        textPart: word,
        circles: letterData.flatMap((it) => it.circles).concat(wordCircle),
        lineSlots: letterData.flatMap((it) => it.lineSlots),
    };
};

const convertTextToLetter = (text: string): TextData<Letter> => {
    const letterCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: 0,
        filled: false,
    };

    const lineSlots = createLineSlots(letterCircle.id, text);

    const letter: Letter = {
        text: text,
        circleId: letterCircle.id,
        lineSlots: lineSlots.map((slot) => slot.id),
    };

    if (isVocal(text)) {
        letterCircle.r = DEFAULT_VOCAL_RADIUS;

        const vocal: Vocal = {
            ...letter,
        };

        return {
            textPart: vocal,
            circles: [letterCircle],
            lineSlots,
        };
    } else {
        letterCircle.r = DEFAULT_CONSONANT_RADIUS;

        const dots = createDots(letterCircle.id, text);

        const consonant: Consonant = {
            ...letter,
            dots: dots.map((dot) => dot.id),
            vocal: Maybe.none(),
        };

        return {
            textPart: consonant,
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
