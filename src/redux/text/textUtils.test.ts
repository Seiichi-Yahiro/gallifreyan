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
import {
    charToLetter,
    digraphReducer,
    sanitizeSentence,
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
            const result = charToLetter('a');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.A,
                decoration: VocalDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ä', () => {
            const result = charToLetter('ä');
            expect(result).toBeNull();
        });

        it('should work with e', () => {
            const result = charToLetter('e');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.E,
                decoration: VocalDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with i', () => {
            const result = charToLetter('i');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.I,
                decoration: VocalDecoration.LineInside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with o', () => {
            const result = charToLetter('o');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.O,
                decoration: VocalDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ö', () => {
            const result = charToLetter('ö');
            expect(result).toBeNull();
        });

        it('should work with u', () => {
            const result = charToLetter('u');
            const expected: Vocal = {
                letterType: LetterType.Vocal,
                value: VocalValue.U,
                decoration: VocalDecoration.LineOutside,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ü', () => {
            const result = charToLetter('ü');
            expect(result).toBeNull();
        });

        it('should work with b', () => {
            const result = charToLetter('b');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.B,
                decoration: ConsonantDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with j', () => {
            const result = charToLetter('j');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.J,
                decoration: ConsonantDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with t', () => {
            const result = charToLetter('t');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.T,
                decoration: ConsonantDecoration.None,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with k', () => {
            const result = charToLetter('k');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.K,
                decoration: ConsonantDecoration.DoubleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with y', () => {
            const result = charToLetter('y');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Y,
                decoration: ConsonantDecoration.DoubleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with d', () => {
            const result = charToLetter('d');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.D,
                decoration: ConsonantDecoration.TripleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with l', () => {
            const result = charToLetter('l');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.L,
                decoration: ConsonantDecoration.TripleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with r', () => {
            const result = charToLetter('r');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.R,
                decoration: ConsonantDecoration.TripleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with z', () => {
            const result = charToLetter('z');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Z,
                decoration: ConsonantDecoration.TripleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with c', () => {
            const result = charToLetter('c');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.C,
                decoration: ConsonantDecoration.QuadrupleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with q', () => {
            const result = charToLetter('q');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.Q,
                decoration: ConsonantDecoration.QuadrupleDot,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with g', () => {
            const result = charToLetter('g');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.G,
                decoration: ConsonantDecoration.SingleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with n', () => {
            const result = charToLetter('n');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.N,
                decoration: ConsonantDecoration.SingleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with v', () => {
            const result = charToLetter('v');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.V,
                decoration: ConsonantDecoration.SingleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with h', () => {
            const result = charToLetter('h');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.H,
                decoration: ConsonantDecoration.DoubleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with p', () => {
            const result = charToLetter('p');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.P,
                decoration: ConsonantDecoration.DoubleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with w', () => {
            const result = charToLetter('w');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.W,
                decoration: ConsonantDecoration.DoubleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with x', () => {
            const result = charToLetter('x');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.X,
                decoration: ConsonantDecoration.DoubleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with f', () => {
            const result = charToLetter('f');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.F,
                decoration: ConsonantDecoration.TripleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with m', () => {
            const result = charToLetter('m');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.M,
                decoration: ConsonantDecoration.TripleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should work with s', () => {
            const result = charToLetter('s');
            const expected: Consonant = {
                letterType: LetterType.Consonant,
                value: ConsonantValue.S,
                decoration: ConsonantDecoration.TripleLine,
            };

            expect(result).toStrictEqual(expected);
        });

        it('should not work with ß', () => {
            const result = charToLetter('ß');
            expect(result).toBeNull();
        });
    });

    describe('combine letters', () => {
        it('should combine th', () => {
            const letters = ['t', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'th',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.TH,
                        decoration: ConsonantDecoration.None,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ph', () => {
            const letters = ['p', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'ph',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.PH,
                        decoration: ConsonantDecoration.SingleDot,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine wh', () => {
            const letters = ['w', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'wh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.WH,
                        decoration: ConsonantDecoration.SingleDot,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine gh', () => {
            const letters = ['g', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'gh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.GH,
                        decoration: ConsonantDecoration.SingleDot,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ch', () => {
            const letters = ['c', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'ch',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.CH,
                        decoration: ConsonantDecoration.DoubleDot,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine sh', () => {
            const letters = ['s', 'h'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'sh',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.SH,
                        decoration: ConsonantDecoration.DoubleDot,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine qu', () => {
            const letters = ['q', 'u'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'qu',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.QU,
                        decoration: ConsonantDecoration.SingleLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should combine ng', () => {
            const letters = ['n', 'g'].map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);
            const expected: TextLetterPair[] = [
                {
                    text: 'ng',
                    letter: {
                        letterType: LetterType.Digraph,
                        value: DigraphValue.NG,
                        decoration: ConsonantDecoration.TripleLine,
                    },
                },
            ];

            expect(result).toStrictEqual(expected);
        });

        it('should not combine other consonants', () => {
            const letters = Object.values(ConsonantValue).map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });

        it('should not combine vocals', () => {
            const letters = Object.values(VocalValue).map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });

        it('should not combine digraphs', () => {
            const letters = Object.values(DigraphValue).map(
                (text): TextLetterPair => ({
                    text,
                    letter: charToLetter(text)!,
                }),
            );

            const result = letters.reduce(digraphReducer, []);

            expect(result).toStrictEqual(letters);
        });
    });
});
