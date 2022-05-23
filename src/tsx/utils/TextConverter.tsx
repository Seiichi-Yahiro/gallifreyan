import { range } from 'lodash';
import { v4 } from 'uuid';
import {
    CircleShape,
    CircleType,
    Consonant,
    ConsonantDecoration,
    Dot,
    Letter,
    LineSlot,
    LineType,
    Sentence,
    UUID,
    Vocal,
    VocalDecoration,
    Word,
} from '../state/image/ImageTypes';
import {
    assignConsonantDecoration,
    assignConsonantPlacement,
    assignVocalDecoration,
    assignVocalPlacement,
    DOUBLE_LETTER,
    isVocal,
} from './LetterGroups';
import { calculateInitialNestedVocalCircleData } from './TextTransforms';

interface TextData {
    id: UUID;
    circles: Partial<Record<UUID, CircleShape>>;
    lineSlots: Partial<Record<UUID, LineSlot>>;
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

export const convertTextToSentence = (text: string): TextData => {
    const id = v4();

    const words: UUID[] = [];
    const circles: Record<UUID, CircleShape> = {};
    const lineSlots: Record<UUID, LineSlot> = {};

    for (const word of text.split(' ').filter((word) => word.length > 0)) {
        const textData = convertTextToWord(word, id);

        words.push(textData.id);
        Object.assign(circles, textData.circles);
        Object.assign(lineSlots, textData.lineSlots);
    }

    const sentence: Sentence = {
        type: CircleType.Sentence,
        text,
        id,
        circle: {
            angle: 0,
            distance: 0,
            r: 0,
        },
        words,
        lineSlots: [],
    };

    Object.assign(circles, { [id]: sentence });

    return {
        id,
        circles,
        lineSlots,
    };
};

const convertTextToWord = (text: string, parentId: UUID): TextData => {
    const id = v4();

    const letters: UUID[] = [];
    const circles: Record<UUID, CircleShape> = {};
    const lineSlots: Record<UUID, LineSlot> = {};

    for (const letter of splitWordToChars(text)) {
        let textData;

        if (isVocal(letter)) {
            textData = convertTextToVocal(letter, id);
        } else {
            textData = convertTextToConsonant(letter, id);
        }

        letters.push(textData.id);
        Object.assign(circles, textData.circles);
        Object.assign(lineSlots, textData.lineSlots);
    }

    const word: Word = {
        type: CircleType.Word,
        text,
        id,
        parentId,
        circle: {
            angle: 0,
            distance: 0,
            r: 0,
        },
        letters,
        lineSlots: [],
    };

    Object.assign(circles, { [id]: word });

    return {
        id,
        circles,
        lineSlots,
    };
};

const convertTextToVocal = (text: string, parentId: UUID): TextData => {
    const id = v4();

    const decoration = assignVocalDecoration(text).unwrap();
    const placement = assignVocalPlacement(text).unwrap();
    const lineSlots = createLineSlots(id, decoration);

    const vocal: Vocal = {
        type: CircleType.Vocal,
        text,
        id,
        parentId,
        circle: {
            angle: 0,
            distance: 0,
            r: 0,
        },
        lineSlots: lineSlots.map((slot) => slot.id),
        placement,
        decoration,
    };

    return {
        id,
        circles: { [id]: vocal },
        lineSlots: lineSlots.reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
    };
};

const convertTextToConsonant = (text: string, parentId: UUID): TextData => {
    const id = v4();

    const decoration = assignConsonantDecoration(text).unwrap();
    const placement = assignConsonantPlacement(text).unwrap();

    const lineSlots = createLineSlots(id, decoration);
    const dots = createDots(id, decoration);

    const consonant: Consonant = {
        type: CircleType.Consonant,
        text,
        id,
        parentId,
        circle: {
            angle: 0,
            distance: 0,
            r: 0,
        },
        lineSlots: lineSlots.map((slot) => slot.id),
        dots: dots.map((dot) => dot.id),
        placement,
        decoration,
    };

    return {
        id,
        circles: [consonant, ...dots].reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
        lineSlots: lineSlots.reduce((acc, it) => ({ ...acc, [it.id]: it }), {}),
    };
};

const createDots = (parentId: UUID, decoration: ConsonantDecoration): Dot[] => {
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
        type: CircleType.Dot,
        id: v4(),
        parentId,
        circle: {
            angle: 0,
            distance: 0,
            r: 0,
        },
    }));
};

const createLineSlots = (parentId: UUID, decoration: ConsonantDecoration | VocalDecoration): LineSlot[] => {
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
        type: LineType.LineSlot,
        id: v4(),
        parentId,
        angle: 0,
        distance: 0,
    }));
};

export const nestWordVocals = (word: Word, letters: Letter[]): { word: Word; letters: Letter[] } => {
    const newLetters = [];
    const newWordLetters = [];

    for (let index = 0; index < letters.length; index++) {
        const letter = letters[index];

        if (letter.type === CircleType.Consonant) {
            const nextLetter = letters.at(index + 1);

            if (nextLetter?.type === CircleType.Vocal) {
                newLetters.push({ ...letter, vocal: nextLetter.id });
                newWordLetters.push(letter.id);

                const vocalCircle = calculateInitialNestedVocalCircleData(
                    nextLetter.placement,
                    letter.placement,
                    letter.circle,
                    word.circle.r
                );

                newLetters.push({ ...nextLetter, circle: vocalCircle, parentId: letter.id });

                index++;
            } else {
                newLetters.push({ ...letter });
                newWordLetters.push(letter.id);
            }
        } else {
            newLetters.push({ ...letter });
            newWordLetters.push(letter.id);
        }
    }

    const newWord: Word = { ...word, letters: newWordLetters };

    return { word: newWord, letters: newLetters };
};
