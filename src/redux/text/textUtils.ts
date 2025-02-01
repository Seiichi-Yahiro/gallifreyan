import {
    type Consonant,
    ConsonantDecoration,
    ConsonantValue,
    DigraphValue,
    LetterType,
    type Vocal,
    VocalDecoration,
    VocalValue,
} from '@/redux/text/letterTypes';
import type { TextLetterPair } from '@/redux/text/textTypes';

export const splitWords = (sentence: string): string[] => sentence.split(' ');

export const splitLetters = (word: string): TextLetterPair[] =>
    word
        .split('')
        .map(
            (letterText): TextLetterPair => ({
                text: letterText,
                letter: charToLetter(letterText)!,
            }),
        )
        .reduce(digraphReducer, []);

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

const vocalDecoration = (vocal: VocalValue): VocalDecoration => {
    switch (vocal) {
        case VocalValue.I: {
            return VocalDecoration.LineInside;
        }
        case VocalValue.U: {
            return VocalDecoration.LineOutside;
        }
        case VocalValue.A:
        case VocalValue.E:
        case VocalValue.O: {
            return VocalDecoration.None;
        }
    }
};

const consonantDecoration = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantDecoration => {
    switch (consonant) {
        case ConsonantValue.B:
        case ConsonantValue.J:
        case ConsonantValue.T:
        case DigraphValue.TH: {
            return ConsonantDecoration.None;
        }
        case DigraphValue.PH:
        case DigraphValue.WH:
        case DigraphValue.GH: {
            return ConsonantDecoration.SingleDot;
        }
        case ConsonantValue.K:
        case ConsonantValue.Y:
        case DigraphValue.CH:
        case DigraphValue.SH: {
            return ConsonantDecoration.DoubleDot;
        }
        case ConsonantValue.D:
        case ConsonantValue.L:
        case ConsonantValue.R:
        case ConsonantValue.Z: {
            return ConsonantDecoration.TripleDot;
        }
        case ConsonantValue.C:
        case ConsonantValue.Q: {
            return ConsonantDecoration.QuadrupleDot;
        }
        case ConsonantValue.G:
        case ConsonantValue.N:
        case ConsonantValue.V:
        case DigraphValue.QU: {
            return ConsonantDecoration.SingleLine;
        }
        case ConsonantValue.H:
        case ConsonantValue.P:
        case ConsonantValue.W:
        case ConsonantValue.X: {
            return ConsonantDecoration.DoubleLine;
        }
        case ConsonantValue.F:
        case ConsonantValue.M:
        case ConsonantValue.S:
        case DigraphValue.NG: {
            return ConsonantDecoration.TripleLine;
        }
    }
};

export const dotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number => {
    switch (decoration) {
        case ConsonantDecoration.SingleDot: {
            return 1;
        }
        case ConsonantDecoration.DoubleDot: {
            return 2;
        }
        case ConsonantDecoration.TripleDot: {
            return 3;
        }
        case ConsonantDecoration.QuadrupleDot: {
            return 4;
        }
        default: {
            return 0;
        }
    }
};

export const lineSlotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number => {
    switch (decoration) {
        case VocalDecoration.LineOutside:
        case VocalDecoration.LineInside:
        case ConsonantDecoration.SingleLine: {
            return 1;
        }
        case ConsonantDecoration.DoubleLine: {
            return 2;
        }
        case ConsonantDecoration.TripleLine: {
            return 3;
        }
        default: {
            return 0;
        }
    }
};

const charToVocal = (char: string): Vocal | null => {
    if (Object.values(VocalValue).includes(char as VocalValue)) {
        const value = char as VocalValue;

        return {
            letterType: LetterType.Vocal,
            value,
            decoration: vocalDecoration(value),
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
        };
    }

    return null;
};

export const charToLetter = (char: string): Vocal | Consonant | null => {
    const upperCaseChar = char.toUpperCase();
    return charToVocal(upperCaseChar) ?? charToConsonant(upperCaseChar);
};

export const digraphReducer = (
    acc: TextLetterPair[],
    next: TextLetterPair,
): TextLetterPair[] => {
    const prev = acc.pop();

    if (!prev) {
        acc.push(next);
        return acc;
    }

    const text = prev.text + next.text;
    const value = text.toUpperCase() as DigraphValue;

    if (Object.values(DigraphValue).includes(value)) {
        acc.push({
            text,
            letter: {
                letterType: LetterType.Digraph,
                value,
                decoration: consonantDecoration(value),
            },
        });
    } else {
        acc.push(prev, next);
    }

    return acc;
};
