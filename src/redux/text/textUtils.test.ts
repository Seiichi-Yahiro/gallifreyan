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
import {
    type RawConsonantElement,
    type RawLetterElement,
    type RawStackedConsonantElement,
    type RawStackedVocalElement,
    type RawVocalElement,
    TextElementType,
} from '@/redux/text/textTypes';
import {
    charToSingleLetter,
    digraphReducer,
    LetterStackType,
    sanitizeSentence,
    splitLetters,
    textToDigraph,
} from '@/redux/text/textUtils';
import { describe, expect, it } from 'vitest';

describe('textUtils', () => {
    describe('sanitize sentence', () => {
        it('should keep all valid characters', () => {
            const valid =
                'AEIOUBJTKYDLRZCQGNVHPWXFMSaeioubjtkydlrzcqgnvhpwxfms';
            const result = sanitizeSentence(valid);

            expect(result).toBe(valid);
        });

        it('should work with multiple words', () => {
            const valid = 'this should work with multiple words';
            const result = sanitizeSentence(valid);

            expect(result).toBe(valid);
        });

        it('should remove invalid characters', () => {
            const result = sanitizeSentence(
                'äöü+*~#\'私i#あ-_.:,;<>|@n€^°1!2²"3§³4$5v%6한글&7/{a8([9)l]0=i}ßd?\\´`',
            );

            expect(result).toBe('invalid');
        });

        it('should remove multiple spaces', () => {
            const valid = '    a                   a    ';
            const result = sanitizeSentence(valid);

            expect(result).toBe('a a');
        });

        it('should work with empty string', () => {
            const valid = '';
            const result = sanitizeSentence(valid);

            expect(result).toBe('');
        });
    });

    describe('char to letter', () => {
        it('should work with a', () => {
            const result = charToSingleLetter('a');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.A,
                decoration: VocalDecoration.None,
                placement: VocalPlacement.Outside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ä', () => {
            const result = charToSingleLetter('ä');
            expect(result).toBeNull();
        });

        it('should work with e', () => {
            const result = charToSingleLetter('e');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.E,
                decoration: VocalDecoration.None,
                placement: VocalPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with i', () => {
            const result = charToSingleLetter('i');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.I,
                decoration: VocalDecoration.LineInside,
                placement: VocalPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with o', () => {
            const result = charToSingleLetter('o');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.O,
                decoration: VocalDecoration.None,
                placement: VocalPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ö', () => {
            const result = charToSingleLetter('ö');
            expect(result).toBeNull();
        });

        it('should work with u', () => {
            const result = charToSingleLetter('u');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.U,
                decoration: VocalDecoration.LineOutside,
                placement: VocalPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ü', () => {
            const result = charToSingleLetter('ü');
            expect(result).toBeNull();
        });

        it('should work with b', () => {
            const result = charToSingleLetter('b');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.B,
                decoration: ConsonantDecoration.None,
                placement: ConsonantPlacement.DeepCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with j', () => {
            const result = charToSingleLetter('j');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.J,
                decoration: ConsonantDecoration.None,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with t', () => {
            const result = charToSingleLetter('t');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.T,
                decoration: ConsonantDecoration.None,
                placement: ConsonantPlacement.ShallowCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with k', () => {
            const result = charToSingleLetter('k');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.K,
                decoration: ConsonantDecoration.DoubleDot,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with y', () => {
            const result = charToSingleLetter('y');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Y,
                decoration: ConsonantDecoration.DoubleDot,
                placement: ConsonantPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with d', () => {
            const result = charToSingleLetter('d');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.D,
                decoration: ConsonantDecoration.TripleDot,
                placement: ConsonantPlacement.DeepCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with l', () => {
            const result = charToSingleLetter('l');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.L,
                decoration: ConsonantDecoration.TripleDot,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with r', () => {
            const result = charToSingleLetter('r');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.R,
                decoration: ConsonantDecoration.TripleDot,
                placement: ConsonantPlacement.ShallowCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with z', () => {
            const result = charToSingleLetter('z');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Z,
                decoration: ConsonantDecoration.TripleDot,
                placement: ConsonantPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with c', () => {
            const result = charToSingleLetter('c');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.C,
                decoration: ConsonantDecoration.QuadrupleDot,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with q', () => {
            const result = charToSingleLetter('q');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Q,
                decoration: ConsonantDecoration.QuadrupleDot,
                placement: ConsonantPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with g', () => {
            const result = charToSingleLetter('g');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.G,
                decoration: ConsonantDecoration.SingleLine,
                placement: ConsonantPlacement.DeepCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with n', () => {
            const result = charToSingleLetter('n');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.N,
                decoration: ConsonantDecoration.SingleLine,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with v', () => {
            const result = charToSingleLetter('v');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.V,
                decoration: ConsonantDecoration.SingleLine,
                placement: ConsonantPlacement.ShallowCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with h', () => {
            const result = charToSingleLetter('h');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.H,
                decoration: ConsonantDecoration.DoubleLine,
                placement: ConsonantPlacement.DeepCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with p', () => {
            const result = charToSingleLetter('p');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.P,
                decoration: ConsonantDecoration.DoubleLine,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with w', () => {
            const result = charToSingleLetter('w');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.W,
                decoration: ConsonantDecoration.DoubleLine,
                placement: ConsonantPlacement.ShallowCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with x', () => {
            const result = charToSingleLetter('x');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.X,
                decoration: ConsonantDecoration.DoubleLine,
                placement: ConsonantPlacement.OnLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with f', () => {
            const result = charToSingleLetter('f');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.F,
                decoration: ConsonantDecoration.TripleLine,
                placement: ConsonantPlacement.DeepCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with m', () => {
            const result = charToSingleLetter('m');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.M,
                decoration: ConsonantDecoration.TripleLine,
                placement: ConsonantPlacement.Inside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with s', () => {
            const result = charToSingleLetter('s');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.S,
                decoration: ConsonantDecoration.TripleLine,
                placement: ConsonantPlacement.ShallowCut,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ß', () => {
            const result = charToSingleLetter('ß');
            expect(result).toBeNull();
        });
    });

    describe('digraph letters', () => {
        it('should digraph th', () => {
            const result = splitLetters('th', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph ph', () => {
            const result = splitLetters('ph', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph wh', () => {
            const result = splitLetters('wh', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph gh', () => {
            const result = splitLetters('gh', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph ch', () => {
            const result = splitLetters('ch', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph sh', () => {
            const result = splitLetters('sh', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph nd', () => {
            const result = splitLetters('nd', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph nt', () => {
            const result = splitLetters('nt', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph qu', () => {
            const result = splitLetters('qu', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should digraph ng', () => {
            const result = splitLetters('ng', {
                digraphs: true,
            });

            const expected: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
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

        it('should not digraph other consonants', () => {
            const letters = Object.values(ConsonantValue).map(
                (text): RawLetterElement => ({
                    elementType: TextElementType.Consonant,
                    text,
                    letter: charToSingleLetter(text) as Consonant,
                }),
            );

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });

        it('should not digraph vocals', () => {
            const letters = Object.values(VocalValue).map(
                (text): RawLetterElement => ({
                    elementType: TextElementType.Vocal,
                    text,
                    letter: charToSingleLetter(text) as Vocal,
                }),
            );

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });

        it('should not digraph ngh with ng digraph', () => {
            const letters: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
                    text: 'ng',
                    letter: textToDigraph('ng')!,
                },
                {
                    elementType: TextElementType.Consonant,
                    text: 'h',
                    letter: charToSingleLetter('h') as Consonant,
                },
            ];

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });

        it('should not digraph ngh with gh digraph', () => {
            const letters: RawLetterElement[] = [
                {
                    elementType: TextElementType.Consonant,
                    text: 'n',
                    letter: charToSingleLetter('n') as Consonant,
                },
                {
                    elementType: TextElementType.Consonant,
                    text: 'gh',
                    letter: textToDigraph('gh')!,
                },
            ];

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });
    });

    describe('stack letters', () => {
        describe('by value', () => {
            Object.values(VocalValue)
                .map(
                    (text): RawVocalElement => ({
                        elementType: TextElementType.Vocal,
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

                        const expected: RawStackedVocalElement[] = [
                            {
                                elementType: TextElementType.StackedVocalGroup,
                                letters: [raw, raw],
                            },
                        ];

                        expect(result).toStrictEqual(expected);
                    });
                });

            Object.values(ConsonantValue)
                .map(
                    (text): RawConsonantElement => ({
                        elementType: TextElementType.Consonant,
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

                        const expected: RawStackedConsonantElement[] = [
                            {
                                elementType:
                                    TextElementType.StackedConsonantGroup,
                                letters: [raw, raw],
                            },
                        ];

                        expect(result).toStrictEqual(expected);
                    });
                });

            Object.values(DigraphValue)
                .map(
                    (text): RawConsonantElement => ({
                        elementType: TextElementType.Consonant,
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

                        const expected: RawStackedConsonantElement[] = [
                            {
                                elementType:
                                    TextElementType.StackedConsonantGroup,
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

                const rawVocal: RawVocalElement = {
                    elementType: TextElementType.Vocal,
                    text: 'a',
                    letter: charToSingleLetter('a') as Vocal,
                };

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.StackedVocalGroup,
                        letters: [rawVocal, rawVocal],
                    },
                    {
                        elementType: TextElementType.StackedVocalGroup,
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

                const rawConsonant: RawConsonantElement = {
                    elementType: TextElementType.Consonant,
                    text: 'b',
                    letter: charToSingleLetter('b') as Consonant,
                };

                const expected: RawLetterElement[] = [
                    {
                        elementType: TextElementType.StackedConsonantGroup,
                        letters: [rawConsonant, rawConsonant],
                    },
                    {
                        elementType: TextElementType.StackedConsonantGroup,
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
                        elementType: TextElementType.Vocal,
                        text: 'a',
                        letter: charToSingleLetter('a') as Vocal,
                    },
                    {
                        elementType: TextElementType.Vocal,
                        text: 'e',
                        letter: charToSingleLetter('e') as Vocal,
                    },
                    {
                        elementType: TextElementType.Consonant,
                        text: 'b',
                        letter: charToSingleLetter('b') as Consonant,
                    },
                    {
                        elementType: TextElementType.Consonant,
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

                const expected: RawStackedConsonantElement[] = [
                    {
                        elementType: TextElementType.StackedConsonantGroup,
                        letters: [
                            ...consonants.split('').map(
                                (text): RawConsonantElement => ({
                                    elementType: TextElementType.Consonant,
                                    text,
                                    letter: charToSingleLetter(
                                        text,
                                    ) as Consonant,
                                }),
                            ),
                            ...digraphs.match(/.{2}/g)!.map(
                                (text): RawConsonantElement => ({
                                    elementType: TextElementType.Consonant,
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

                const expected: RawStackedVocalElement[] = [
                    {
                        elementType: TextElementType.StackedVocalGroup,
                        letters: 'eiu'.split('').map(
                            (text): RawVocalElement => ({
                                elementType: TextElementType.Vocal,
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
                        elementType: TextElementType.Vocal,
                        text: 'a',
                        letter: charToSingleLetter('a') as Vocal,
                    },
                    {
                        elementType: TextElementType.Vocal,
                        text: 'e',
                        letter: charToSingleLetter('e') as Vocal,
                    },
                    {
                        elementType: TextElementType.Consonant,
                        text: 'b',
                        letter: charToSingleLetter('b') as Consonant,
                    },
                    {
                        elementType: TextElementType.Consonant,
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

            const rawVocal: RawVocalElement = {
                elementType: TextElementType.Vocal,
                text: 'a',
                letter: charToSingleLetter('a') as Vocal,
            };

            const expected: RawLetterElement[] = [rawVocal, rawVocal];

            expect(result).toStrictEqual(expected);
        });
    });
});
