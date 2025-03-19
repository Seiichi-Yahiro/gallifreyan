import {
    type Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
    ConsonantValue,
    type Digraph,
    DigraphValue,
    LetterType,
    type Vocal,
    VocalDecoration,
    VocalPlacement,
    VocalValue,
} from '@/redux/text/letterTypes';
import {
    type RawConsonantElement,
    type RawLetterElement,
    type RawStackedConsonantElement,
    type RawStackedVocalElement,
    type RawVocalElement,
    TextElementType,
} from '@/redux/text/textTypes';
import { match, Pattern } from 'ts-pattern';

export const isDigraphText = (text: string): boolean =>
    Object.values(DigraphValue).includes(text.toUpperCase() as DigraphValue);

export const splitWords = (sentence: string): string[] => sentence.split(' ');

export interface SplitLettersOptions {
    digraphs?: boolean;
    doubleLetters?: boolean;
}

export const splitLetters = (
    word: string,
    options?: SplitLettersOptions,
): RawLetterElement[] => {
    let letters = word.split('').map((letterText): RawLetterElement => {
        const letter = charToSingleLetter(letterText)!;

        return match(letter)
            .with(
                { letterType: LetterType.Vocal },
                (vocal): RawVocalElement => ({
                    elementType: TextElementType.Vocal,
                    text: letterText,
                    letter: vocal,
                }),
            )
            .with(
                { letterType: LetterType.Consonant },
                (consonant): RawConsonantElement => ({
                    elementType: TextElementType.Consonant,
                    text: letterText,
                    letter: consonant,
                }),
            )
            .exhaustive();
    });

    if (options?.digraphs) {
        letters = letters.reduce(digraphReducer, []);
    }

    if (options?.doubleLetters) {
        letters = letters.reduce(doubleLetterReducer, []);
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

const vocalDecoration = (vocal: VocalValue): VocalDecoration =>
    match(vocal)
        .with(VocalValue.I, () => VocalDecoration.LineInside)
        .with(VocalValue.U, () => VocalDecoration.LineOutside)
        .with(
            VocalValue.A,
            VocalValue.E,
            VocalValue.O,
            () => VocalDecoration.None,
        )
        .exhaustive();

const consonantDecoration = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantDecoration =>
    match(consonant)
        .with(
            ConsonantValue.B,
            ConsonantValue.J,
            ConsonantValue.T,
            DigraphValue.TH,
            () => ConsonantDecoration.None,
        )
        .with(
            DigraphValue.PH,
            DigraphValue.WH,
            DigraphValue.GH,
            () => ConsonantDecoration.SingleDot,
        )
        .with(
            ConsonantValue.K,
            ConsonantValue.Y,
            DigraphValue.CH,
            DigraphValue.SH,
            () => ConsonantDecoration.DoubleDot,
        )
        .with(
            ConsonantValue.D,
            ConsonantValue.L,
            ConsonantValue.R,
            ConsonantValue.Z,
            () => ConsonantDecoration.TripleDot,
        )
        .with(
            DigraphValue.ND,
            ConsonantValue.C,
            DigraphValue.NT,
            ConsonantValue.Q,
            () => ConsonantDecoration.QuadrupleDot,
        )
        .with(
            ConsonantValue.G,
            ConsonantValue.N,
            ConsonantValue.V,
            DigraphValue.QU,
            () => ConsonantDecoration.SingleLine,
        )
        .with(
            ConsonantValue.H,
            ConsonantValue.P,
            ConsonantValue.W,
            ConsonantValue.X,
            () => ConsonantDecoration.DoubleLine,
        )
        .with(
            ConsonantValue.F,
            ConsonantValue.M,
            ConsonantValue.S,
            DigraphValue.NG,
            () => ConsonantDecoration.TripleLine,
        )
        .exhaustive();

const vocalPlacement = (vocal: VocalValue): VocalPlacement =>
    match(vocal)
        .with(VocalValue.A, () => VocalPlacement.Outside)
        .with(VocalValue.O, () => VocalPlacement.Inside)
        .with(
            VocalValue.E,
            VocalValue.I,
            VocalValue.U,
            () => VocalPlacement.OnLine,
        )
        .exhaustive();

const consonantPlacement = (
    consonant: ConsonantValue | DigraphValue,
): ConsonantPlacement =>
    match(consonant)
        .with(
            ConsonantValue.B,
            DigraphValue.CH,
            ConsonantValue.D,
            DigraphValue.ND,
            ConsonantValue.G,
            ConsonantValue.H,
            ConsonantValue.F,
            () => ConsonantPlacement.DeepCut,
        )
        .with(
            ConsonantValue.J,
            DigraphValue.PH,
            ConsonantValue.K,
            ConsonantValue.L,
            ConsonantValue.C,
            ConsonantValue.N,
            ConsonantValue.P,
            ConsonantValue.M,
            () => ConsonantPlacement.Inside,
        )
        .with(
            ConsonantValue.T,
            DigraphValue.WH,
            DigraphValue.SH,
            ConsonantValue.R,
            DigraphValue.NT,
            ConsonantValue.V,
            ConsonantValue.W,
            ConsonantValue.S,
            () => ConsonantPlacement.ShallowCut,
        )
        .with(
            DigraphValue.TH,
            DigraphValue.GH,
            ConsonantValue.Y,
            ConsonantValue.Z,
            ConsonantValue.Q,
            DigraphValue.QU,
            ConsonantValue.X,
            DigraphValue.NG,
            () => ConsonantPlacement.OnLine,
        )
        .exhaustive();

export const dotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number =>
    match(decoration)
        .with(ConsonantDecoration.SingleDot, () => 1)
        .with(ConsonantDecoration.DoubleDot, () => 2)
        .with(ConsonantDecoration.TripleDot, () => 3)
        .with(ConsonantDecoration.QuadrupleDot, () => 4)
        .otherwise(() => 0);

export const lineSlotAmount = (
    decoration: VocalDecoration | ConsonantDecoration,
): number =>
    match(decoration)
        .with(
            VocalDecoration.LineOutside,
            VocalDecoration.LineInside,
            ConsonantDecoration.SingleLine,
            () => 1,
        )
        .with(ConsonantDecoration.DoubleLine, () => 2)
        .with(ConsonantDecoration.TripleLine, () => 3)
        .otherwise(() => 0);

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
    acc: RawLetterElement[],
    next: RawLetterElement,
): RawLetterElement[] => {
    const prev = acc.at(-1);

    match([prev, next])
        .with(
            [
                {
                    elementType: TextElementType.Consonant,
                    letter: { letterType: LetterType.Consonant },
                },
                Pattern.union(
                    {
                        elementType: TextElementType.Consonant,
                        letter: { letterType: LetterType.Consonant },
                    },
                    { elementType: TextElementType.Vocal },
                ),
            ],
            ([prev, next]) => {
                acc.pop();

                const text = prev.text + next.text;
                const digraph = textToDigraph(text);

                if (digraph) {
                    acc.push({
                        elementType: TextElementType.Consonant,
                        text,
                        letter: digraph,
                    });
                } else {
                    acc.push(prev, next);
                }
            },
        )
        .otherwise(() => {
            acc.push(next);
        });

    return acc;
};

export const doubleLetterReducer = (
    acc: RawLetterElement[],
    next: RawLetterElement,
): RawLetterElement[] => {
    const prev = acc.at(-1);

    match([prev, next])
        .with(
            [
                {
                    elementType: TextElementType.Consonant,
                },
                {
                    elementType: TextElementType.Consonant,
                },
            ],
            ([prev, next]) => prev.letter.value === next.letter.value,
            ([prev, next]) => {
                acc.pop();

                acc.push({
                    elementType: TextElementType.StackedConsonantGroup,
                    letters: [prev, next],
                } satisfies RawStackedConsonantElement);
            },
        )
        .with(
            [
                { elementType: TextElementType.Vocal },
                { elementType: TextElementType.Vocal },
            ],
            ([prev, next]) => prev.letter.value === next.letter.value,
            ([prev, next]) => {
                acc.pop();

                acc.push({
                    elementType: TextElementType.StackedVocalGroup,
                    letters: [prev, next],
                } satisfies RawStackedVocalElement);
            },
        )
        .otherwise(() => {
            acc.push(next);
        });

    return acc;
};
