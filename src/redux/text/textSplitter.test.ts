import {
    type Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
    ConsonantValue,
    DigraphValue,
    LetterType,
    type Vocal,
    VocalValue,
} from '@/redux/text/letterTypes';
import {
    charToSingleLetter,
    textToDigraph,
} from '@/redux/text/textLetterUtils';
import { LetterStackType, splitLetters } from '@/redux/text/textSplitter';
import {
    RawLetter,
    type RawLetterElement,
    type RawStackedLetter,
    TextElementType,
} from '@/redux/text/textTypes';
import { describe, expect, it } from 'vitest';

describe('Text splitter', () => {
    describe('digraph letters', () => {
        it('should combine th', () => {
            const result = splitLetters('th', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'th',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.TH,
                        decoration: ConsonantDecoration.None,
                        placement: ConsonantPlacement.OnLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ph', () => {
            const result = splitLetters('ph', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'ph',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.PH,
                        decoration: ConsonantDecoration.SingleDot,
                        placement: ConsonantPlacement.Inside,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine wh', () => {
            const result = splitLetters('wh', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'wh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.WH,
                        decoration: ConsonantDecoration.SingleDot,
                        placement: ConsonantPlacement.ShallowCut,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine gh', () => {
            const result = splitLetters('gh', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'gh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.GH,
                        decoration: ConsonantDecoration.SingleDot,
                        placement: ConsonantPlacement.OnLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ch', () => {
            const result = splitLetters('ch', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'ch',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.CH,
                        decoration: ConsonantDecoration.DoubleDot,
                        placement: ConsonantPlacement.DeepCut,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine sh', () => {
            const result = splitLetters('sh', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'sh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.SH,
                        decoration: ConsonantDecoration.DoubleDot,
                        placement: ConsonantPlacement.ShallowCut,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine nd', () => {
            const result = splitLetters('nd', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'nd',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.ND,
                        decoration: ConsonantDecoration.QuadrupleDot,
                        placement: ConsonantPlacement.DeepCut,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine nt', () => {
            const result = splitLetters('nt', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'nt',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.NT,
                        decoration: ConsonantDecoration.QuadrupleDot,
                        placement: ConsonantPlacement.ShallowCut,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine qu', () => {
            const result = splitLetters('qu', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'qu',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.QU,
                        decoration: ConsonantDecoration.SingleLine,
                        placement: ConsonantPlacement.OnLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ng', () => {
            const result = splitLetters('ng', { digraphs: true });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Letter,
                    text: 'ng',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.NG,
                        decoration: ConsonantDecoration.TripleLine,
                        placement: ConsonantPlacement.OnLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });
    });

    describe('stack letters', () => {
        describe('by value', () => {
            Object.values(VocalValue)
                .map(
                    (text): RawLetter => ({
                        elementType: TextElementType.Letter,
                        text,
                        letter: charToSingleLetter(text) as Vocal,
                    }),
                )
                .forEach((raw) => {
                    it(`should stack ${raw.text}`, () => {
                        const result = splitLetters(raw.text + raw.text, {
                            digraphs: false,
                            stackLetters: {
                                stackType: LetterStackType.Value,
                                maxStackSize: 0,
                            },
                        });

                        const expected: RawStackedLetter[] = [
                            {
                                elementType: TextElementType.StackedLetter,
                                letters: [raw, raw],
                            },
                        ];

                        expect(result).toStrictEqual(expected);
                    });
                });

            Object.values(ConsonantValue)
                .map(
                    (text): RawLetter => ({
                        elementType: TextElementType.Letter,
                        text,
                        letter: charToSingleLetter(text) as Consonant,
                    }),
                )
                .forEach((raw) => {
                    it(`should stack ${raw.text}`, () => {
                        const result = splitLetters(raw.text + raw.text, {
                            digraphs: false,
                            stackLetters: {
                                stackType: LetterStackType.Value,
                                maxStackSize: 0,
                            },
                        });

                        const expected: RawStackedLetter[] = [
                            {
                                elementType: TextElementType.StackedLetter,
                                letters: [raw, raw],
                            },
                        ];

                        expect(result).toStrictEqual(expected);
                    });
                });

            Object.values(DigraphValue)
                .map(
                    (text): RawLetter => ({
                        elementType: TextElementType.Letter,
                        text,
                        letter: textToDigraph(text)!,
                    }),
                )
                .forEach((raw) => {
                    it(`should stack ${raw.text}`, () => {
                        const result = splitLetters(raw.text + raw.text, {
                            digraphs: true,
                            stackLetters: {
                                stackType: LetterStackType.Value,
                                maxStackSize: 0,
                            },
                        });

                        const expected: RawStackedLetter[] = [
                            {
                                elementType: TextElementType.StackedLetter,
                                letters: [raw, raw],
                            },
                        ];

                        expect(result).toStrictEqual(expected);
                    });
                });

            it('should stack max 2 vocals', () => {
                const result = splitLetters('aaaa', {
                    digraphs: false,
                    stackLetters: {
                        stackType: LetterStackType.Value,
                        maxStackSize: 2,
                    },
                });

                const rawVocal: RawLetter = {
                    elementType: TextElementType.Letter,
                    text: 'a',
                    letter: charToSingleLetter('a') as Vocal,
                };

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: [rawVocal, rawVocal],
                    },
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: [rawVocal, rawVocal],
                    },
                ];

                expect(result).toStrictEqual(expected);
            });

            it('should stack max 2 consonants', () => {
                const result = splitLetters('bbbb', {
                    digraphs: false,
                    stackLetters: {
                        stackType: LetterStackType.Value,
                        maxStackSize: 2,
                    },
                });

                const rawConsonant: RawLetter = {
                    elementType: TextElementType.Letter,
                    text: 'b',
                    letter: charToSingleLetter('b') as Consonant,
                };

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: [rawConsonant, rawConsonant],
                    },
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: [rawConsonant, rawConsonant],
                    },
                ];

                expect(result).toStrictEqual(expected);
            });

            it('should not stack different values', () => {
                const result = splitLetters('aebj', {
                    digraphs: false,
                    stackLetters: {
                        stackType: LetterStackType.Value,
                        maxStackSize: 1,
                    },
                });

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.Letter,
                        text: 'a',
                        letter: charToSingleLetter('a') as Vocal,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'e',
                        letter: charToSingleLetter('e') as Vocal,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'b',
                        letter: charToSingleLetter('b') as Consonant,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'j',
                        letter: charToSingleLetter('j') as Consonant,
                    },
                ];

                expect(result).toStrictEqual(expected);
            });
        });

        describe('by placement', () => {
            const expectConsonantStack = (
                consonants: string,
                digraphs: string,
            ) => {
                const result = splitLetters(consonants + digraphs, {
                    digraphs: true,
                    stackLetters: {
                        stackType: LetterStackType.Placement,
                        maxStackSize: 0,
                    },
                });

                const expected: RawStackedLetter[] = [
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: [
                            ...consonants.split('').map(
                                (text): RawLetter => ({
                                    elementType: TextElementType.Letter,
                                    text,
                                    letter: charToSingleLetter(
                                        text,
                                    ) as Consonant,
                                }),
                            ),
                            ...digraphs.match(/.{2}/g)!.map(
                                (text): RawLetter => ({
                                    elementType: TextElementType.Letter,
                                    text,
                                    letter: textToDigraph(text)!,
                                }),
                            ),
                        ],
                    },
                ];

                expect(result).toStrictEqual(expected);
            };

            it('should stack b ch d nd g h f', () => {
                expectConsonantStack('bdhgf', 'chnd');
            });

            it('should stack j ph k l c n p m', () => {
                expectConsonantStack('jklcnpm', 'ph');
            });

            it('should stack t wh sh r nt v w s', () => {
                expectConsonantStack('trvws', 'whshnt');
            });

            it('should stack th gh y z q qu x ng', () => {
                expectConsonantStack('yzqx', 'ghqung');
            });

            it('should stack e i u', () => {
                const result = splitLetters('eiu', {
                    digraphs: true,
                    stackLetters: {
                        stackType: LetterStackType.Placement,
                        maxStackSize: 3,
                    },
                });

                const expected: RawStackedLetter[] = [
                    {
                        elementType: TextElementType.StackedLetter,
                        letters: 'eiu'.split('').map(
                            (text): RawLetter => ({
                                elementType: TextElementType.Letter,
                                text,
                                letter: charToSingleLetter(text) as Vocal,
                            }),
                        ),
                    },
                ];

                expect(result).toStrictEqual(expected);
            });

            it('should not stack different placements', () => {
                const result = splitLetters('aebj', {
                    digraphs: false,
                    stackLetters: {
                        stackType: LetterStackType.Placement,
                        maxStackSize: 4,
                    },
                });

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.Letter,
                        text: 'a',
                        letter: charToSingleLetter('a') as Vocal,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'e',
                        letter: charToSingleLetter('e') as Vocal,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'b',
                        letter: charToSingleLetter('b') as Consonant,
                    },
                    {
                        elementType: TextElementType.Letter,
                        text: 'j',
                        letter: charToSingleLetter('j') as Consonant,
                    },
                ];

                expect(result).toStrictEqual(expected);
            });
        });

        it('should not stack with max stack of 1', () => {
            const result = splitLetters('aa', {
                digraphs: false,
                stackLetters: {
                    stackType: LetterStackType.Placement,
                    maxStackSize: 1,
                },
            });

            const rawVocal: RawLetter = {
                elementType: TextElementType.Letter,
                text: 'a',
                letter: charToSingleLetter('a') as Vocal,
            };

            const expected: RawLetterElement[] = [rawVocal, rawVocal];

            expect(result).toStrictEqual(expected);
        });
    });
});
