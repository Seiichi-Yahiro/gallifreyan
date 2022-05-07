import { last, range } from 'lodash';
import { v4 } from 'uuid';
import {
    Circle,
    Consonant,
    ConsonantDecoration,
    Letter,
    LineSlot,
    Sentence,
    UUID,
    Vocal,
    VocalDecoration,
    Word,
} from '../state/ImageTypes';
import {
    assignConsonantDecoration,
    assignConsonantPlacement,
    assignVocalDecoration,
    assignVocalPlacement,
    DOUBLE_LETTER,
    isLetterConsonant,
    isLetterVocal,
    isVocal,
} from './LetterGroups';
import Maybe from './Maybe';
import {
    DEFAULT_CONSONANT_RADIUS,
    DEFAULT_DOT_RADIUS,
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

    const wordData = text
        .split(' ')
        .filter((word) => word.length > 0)
        .map(convertTextToWord);

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

const convertTextToLetter = (text: string): TextData<Letter> =>
    isVocal(text) ? convertTextToVocal(text) : convertTextToConsonant(text);

const convertTextToVocal = (text: string): TextData<Vocal> => {
    const vocalCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: DEFAULT_VOCAL_RADIUS,
        filled: false,
    };

    const decoration = assignVocalDecoration(text).unwrap();
    const lineSlots = createLineSlots(vocalCircle.id, decoration);

    const vocal: Vocal = {
        text,
        circleId: vocalCircle.id,
        lineSlots: lineSlots.map((slot) => slot.id),
        placement: assignVocalPlacement(text).unwrap(),
        decoration,
    };

    return {
        textPart: vocal,
        circles: [vocalCircle],
        lineSlots,
    };
};

const convertTextToConsonant = (text: string): TextData<Consonant> => {
    const consonantCircle: Circle = {
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: DEFAULT_CONSONANT_RADIUS,
        filled: false,
    };

    const decoration = assignConsonantDecoration(text).unwrap();

    const lineSlots = createLineSlots(consonantCircle.id, decoration);
    const dots = createDots(consonantCircle.id, decoration);

    const consonant: Consonant = {
        text: text,
        circleId: consonantCircle.id,
        lineSlots: lineSlots.map((slot) => slot.id),
        dots: dots.map((dot) => dot.id),
        vocal: Maybe.none(),
        placement: assignConsonantPlacement(text).unwrap(),
        decoration,
    };

    return {
        textPart: consonant,
        circles: dots.concat(consonantCircle),
        lineSlots,
    };
};

const createDots = (letterId: UUID, decoration: ConsonantDecoration): Circle[] => {
    const numberOfDots = () => {
        switch (decoration) {
            case ConsonantDecoration.SingleDot:
                return 1;
            case ConsonantDecoration.DoubleDot:
                return 2;
            case ConsonantDecoration.TripleDot:
                return 3;
            case ConsonantDecoration.QuadrupleDot:
                return 4;
            default:
                return 0;
        }
    };

    return range(numberOfDots()).map((_i) => ({
        id: v4(),
        angle: 0,
        parentDistance: 0,
        r: DEFAULT_DOT_RADIUS,
        filled: true,
    }));
};

const createLineSlots = (letterId: UUID, decoration: ConsonantDecoration | VocalDecoration): LineSlot[] => {
    const numberOfLineSlots = () => {
        switch (decoration) {
            case ConsonantDecoration.SingleLine:
            case VocalDecoration.LineOutside:
            case VocalDecoration.LineInside:
                return 1;
            case ConsonantDecoration.DoubleLine:
                return 2;
            case ConsonantDecoration.TripleLine:
                return 3;
            default:
                return 0;
        }
    };

    return range(numberOfLineSlots()).map((_i) => ({
        id: v4(),
        angle: 0,
        parentDistance: 0,
        connection: Maybe.none(),
    }));
};
