import {
    ConsonantValue,
    LetterType,
    VocalValue,
} from '@/redux/text/letterTypes';
import {
    charToSingleLetter,
    textToDigraph,
} from '@/redux/text/textLetterUtils';
import {
    type RawAttachedLetter,
    type RawLetter,
    type RawLetterElement,
    type RawStackedLetter,
    TextElementType,
} from '@/redux/text/textTypes';
import { match, Pattern } from 'ts-pattern';

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

export const splitWords = (sentence: string): string[] => sentence.split(' ');

export interface SplitLettersOptions {
    digraphs?: boolean;
    stackLetters?: StackLetterOptions;
    attachVocals?: boolean;
}

export const splitLetters = (
    word: string,
    options?: SplitLettersOptions,
): RawLetterElement[] => {
    let letters: RawLetterElement[] = word.split('').map(
        (letterText): RawLetter => ({
            elementType: TextElementType.Letter,
            text: letterText,
            letter: charToSingleLetter(letterText)!,
        }),
    );

    if (options?.digraphs) {
        letters = letters.reduce(digraphReducer, []);
    }

    if (options?.stackLetters) {
        letters = letters.reduce(
            createStackLetterReducer(options.stackLetters),
            [],
        );
    }

    if (options?.attachVocals) {
        letters = letters.reduce(attachLetterReducer, []);
    }

    return letters;
};

const digraphReducer = (acc: RawLetter[], next: RawLetter): RawLetter[] => {
    const prev = acc.pop();

    if (!prev) {
        acc.push(next);
        return acc;
    }

    const text = prev.text + next.text;
    const digraph = textToDigraph(text);

    if (digraph) {
        acc.push({
            elementType: TextElementType.Letter,
            text,
            letter: digraph,
        });
    } else {
        acc.push(prev, next);
    }

    return acc;
};

export enum LetterStackType {
    Value = 'Value',
    Placement = 'Placement',
}

export interface StackLetterOptions {
    stackType: LetterStackType;
    maxStackSize: number;
}

type RawLetterElementReducer = (
    acc: RawLetterElement[],
    next: RawLetterElement,
) => RawLetterElement[];

const createStackLetterReducer = (
    options: StackLetterOptions,
): RawLetterElementReducer => {
    const maxStackSize =
        options.maxStackSize <= 0
            ? Number.POSITIVE_INFINITY
            : options.maxStackSize;

    if (maxStackSize === 1) {
        return (acc, next) => {
            acc.push(next);
            return acc;
        };
    }

    type SingleComparator = ([prev, next]: readonly [
        RawLetter,
        RawLetter,
    ]) => boolean;

    const singleValueComparator: SingleComparator = ([prev, next]) =>
        prev.letter.value === next.letter.value;

    const singlePlacementComparator: SingleComparator = ([prev, next]) =>
        prev.letter.placement === next.letter.placement;

    const singleComparator = match(options.stackType)
        .with(LetterStackType.Value, () => singleValueComparator)
        .with(LetterStackType.Placement, () => singlePlacementComparator)
        .exhaustive();

    const multiValueComparator = ([prev, next]: readonly [
        RawStackedLetter,
        RawLetter,
    ]) =>
        prev.letters.length < maxStackSize &&
        singleComparator([prev.letters[0], next]);

    return (acc, next) => {
        const prev = acc.at(-1);

        match([prev, next])
            .with(
                [
                    {
                        elementType: TextElementType.Letter,
                    },
                    {
                        elementType: TextElementType.Letter,
                    },
                ],
                singleComparator,
                ([prev, next]) => {
                    acc.pop();

                    acc.push({
                        elementType: TextElementType.StackedLetter,
                        letters: [prev, next],
                    } satisfies RawStackedLetter);
                },
            )
            .with(
                [
                    {
                        elementType: TextElementType.StackedLetter,
                    },
                    {
                        elementType: TextElementType.Letter,
                    },
                ],
                multiValueComparator,
                ([prev, next]) => {
                    prev.letters.push(next);
                },
            )
            .otherwise(() => {
                acc.push(next);
            });

        return acc;
    };
};

const attachLetterReducer: RawLetterElementReducer = (acc, next) => {
    const prev = acc.at(-1);

    match([prev, next])
        .with(
            [
                Pattern.union(
                    {
                        elementType: TextElementType.Letter,
                        letter: {
                            letterType: Pattern.union(
                                LetterType.Consonant,
                                LetterType.Digraph,
                            ),
                        },
                    },
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: Pattern.array({
                            letter: {
                                letterType: Pattern.union(
                                    LetterType.Consonant,
                                    LetterType.Digraph,
                                ),
                            },
                        }),
                    },
                ),
                Pattern.union(
                    {
                        elementType: TextElementType.Letter,
                        letter: {
                            letterType: LetterType.Vocal,
                        },
                    },
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: Pattern.array({
                            letter: {
                                letterType: LetterType.Vocal,
                            },
                        }),
                    },
                ),
            ],
            ([prev, next]) => {
                acc.pop();

                acc.push({
                    elementType: TextElementType.AttachedLetter,
                    letters: [prev, next],
                } satisfies RawAttachedLetter);
            },
        )
        .otherwise(() => {
            acc.push(next);
        });

    return acc;
};
