import {
    type Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
    ConsonantValue,
    DigraphValue,
    LetterType,
    type Vocal,
    VocalDecoration,
    VocalPlacement,
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

const vocalPlacement = (vocal: VocalValue): VocalPlacement => {
    switch (vocal) {
        case VocalValue.A: {
            return VocalPlacement.Outside;
        }
        case VocalValue.O: {
            return VocalPlacement.Inside;
        }
        case VocalValue.E:
        case VocalValue.I:
        case VocalValue.U: {
            return VocalPlacement.OnLine;
        }
    }
};

const consonantPlacement = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantPlacement => {
    switch (consonant) {
        case ConsonantValue.B:
        case DigraphValue.CH:
        case ConsonantValue.D:
        case ConsonantValue.G:
        case ConsonantValue.H:
        case ConsonantValue.F: {
            return ConsonantPlacement.DeepCut;
        }
        case ConsonantValue.J:
        case DigraphValue.PH:
        case ConsonantValue.K:
        case ConsonantValue.L:
        case ConsonantValue.C:
        case ConsonantValue.N:
        case ConsonantValue.P:
        case ConsonantValue.M: {
            return ConsonantPlacement.Inside;
        }
        case ConsonantValue.T:
        case DigraphValue.WH:
        case DigraphValue.SH:
        case ConsonantValue.R:
        case ConsonantValue.V:
        case ConsonantValue.W:
        case ConsonantValue.S: {
            return ConsonantPlacement.ShallowCut;
        }
        case DigraphValue.TH:
        case DigraphValue.GH:
        case ConsonantValue.Y:
        case ConsonantValue.Z:
        case ConsonantValue.Q:
        case DigraphValue.QU:
        case ConsonantValue.X:
        case DigraphValue.NG: {
            return ConsonantPlacement.OnLine;
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
                placement: consonantPlacement(value),
            },
        });
    } else {
        acc.push(prev, next);
    }

    return acc;
};
