import {
    type Consonant,
    ConsonantValue,
    type Digraph,
    DigraphValue,
    type Letter,
    LetterType,
    type Vocal,
    VocalValue,
} from '@/redux/types/letterTypes';
import {
    consonantDecoration,
    consonantPlacement,
    vocalDecoration,
    vocalPlacement,
} from '@/redux/utils/letterUtils';

export const splitWords = (sentence: string): string[] => sentence.split(' ');

export interface RawLetter {
    text: string;
    letter: Letter;
}

export interface SplitLettersOptions {
    digraphs?: boolean;
}

export const splitLetters = (
    word: string,
    options?: SplitLettersOptions,
): RawLetter[] => {
    let letters = word.split('').map(
        (letterText): RawLetter => ({
            text: letterText,
            letter: charToSingleLetter(letterText)!,
        }),
    );

    if (options?.digraphs) {
        letters = letters.reduce(digraphReducer, []);
    }

    return letters;
};

export const sanitizeSentence = (sentence: string): string => {
    const vocals = Object.values<string>(VocalValue);
    const consonants = Object.values<string>(ConsonantValue);

    return sentence
        .split(' ')
        .filter((word) => word.length > 0)
        .map((word) =>
            word
                .split('')
                .filter((letter) => {
                    const upperCaseLetter = letter.toUpperCase();
                    return (
                        vocals.includes(upperCaseLetter) ||
                        consonants.includes(upperCaseLetter)
                    );
                })
                .join(''),
        )
        .join(' ');
};

const charToVocal = (char: string): Vocal | null => {
    if (Object.values(VocalValue).includes(char as VocalValue)) {
        const value = char as VocalValue;

        return {
            letterType: LetterType.Vocal,
            value,
            decoration: vocalDecoration(value),
            placement: vocalPlacement(value),
        };
    }

    return null;
};

const charToConsonant = (char: string): Consonant | null => {
    if (Object.values(ConsonantValue).includes(char as ConsonantValue)) {
        const value = char as ConsonantValue;

        return {
            letterType: LetterType.Consonant,
            value,
            decoration: consonantDecoration(value),
            placement: consonantPlacement(value),
        };
    }

    return null;
};

export const charToSingleLetter = (char: string): Vocal | Consonant | null => {
    const upperCaseChar = char.toUpperCase();
    return charToVocal(upperCaseChar) ?? charToConsonant(upperCaseChar);
};

export const isDigraphText = (text: string): boolean =>
    Object.values(DigraphValue).includes(text.toUpperCase() as DigraphValue);

export const textToDigraph = (text: string): Digraph | null => {
    if (!isDigraphText(text)) {
        return null;
    }

    const value = text.toUpperCase() as DigraphValue;

    return {
        letterType: LetterType.Digraph,
        value,
        decoration: consonantDecoration(value),
        placement: consonantPlacement(value),
    };
};

export const digraphReducer = (
    acc: RawLetter[],
    next: RawLetter,
): RawLetter[] => {
    const prev = acc.pop();

    if (!prev) {
        acc.push(next);
        return acc;
    }

    const text = prev.text + next.text;
    const digraph = textToDigraph(text);

    if (digraph) {
        acc.push({
            text,
            letter: digraph,
        });
    } else {
        acc.push(prev, next);
    }

    return acc;
};
