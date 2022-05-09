import {
    Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
    Vocal,
    VocalDecoration,
    VocalPlacement,
} from '../state/ImageTypes';
import { convertTextToSentence, splitWordToChars } from './TextConverter';

describe('TextConverter', () => {
    it('should split lower case word', () => {
        const result = splitWordToChars('aeioubjtthphwhghchkshydlrzcqgnvquhpwxfmsng');
        expect(result).toEqual([
            'a',
            'e',
            'i',
            'o',
            'u',
            'b',
            'j',
            't',
            'th',
            'ph',
            'wh',
            'gh',
            'ch',
            'k',
            'sh',
            'y',
            'd',
            'l',
            'r',
            'z',
            'c',
            'q',
            'g',
            'n',
            'v',
            'qu',
            'h',
            'p',
            'w',
            'x',
            'f',
            'm',
            's',
            'ng',
        ]);
    });

    it('should split upper case word', () => {
        const result = splitWordToChars('AEIOUBJTTHPHWHGHCHKSHYDLRZCQGNVQUHPWXFMSNG');
        expect(result).toEqual([
            'A',
            'E',
            'I',
            'O',
            'U',
            'B',
            'J',
            'T',
            'TH',
            'PH',
            'WH',
            'GH',
            'CH',
            'K',
            'SH',
            'Y',
            'D',
            'L',
            'R',
            'Z',
            'C',
            'Q',
            'G',
            'N',
            'V',
            'QU',
            'H',
            'P',
            'W',
            'X',
            'F',
            'M',
            'S',
            'NG',
        ]);
    });

    it('should split mixed case double letters', () => {
        const result = splitWordToChars('tHThpHPhwHWhgHGhcHChsHShqUQunGNg');
        expect(result).toEqual([
            'tH',
            'Th',
            'pH',
            'Ph',
            'wH',
            'Wh',
            'gH',
            'Gh',
            'cH',
            'Ch',
            'sH',
            'Sh',
            'qU',
            'Qu',
            'nG',
            'Ng',
        ]);
    });

    it('should convert text to circles', () => {
        const { circles } = convertTextToSentence('aeiou bjtth phwhgh chkshy dlrz cq gnvqu hpwx fmsng');

        // 5 vocals
        // 29 consonants
        // 31 dots
        // 9 words
        // 1 sentence
        expect(circles.length).toBe(75);
    });

    it('should convert text to line slots', () => {
        const { lineSlots } = convertTextToSentence('aeiou bjtth phwhgh chkshy dlrz cq gnvqu hpwx fmsng');

        // 2 vocals
        // 24 consonants
        expect(lineSlots.length).toBe(26);
    });

    it('should convert text to sentence', () => {
        const { textPart: sentence } = convertTextToSentence('aeiou bjtth phwhgh chkshy dlrz cq gnvqu hpwx fmsng');

        expect(sentence.text).toBe('aeiou bjtth phwhgh chkshy dlrz cq gnvqu hpwx fmsng');
        expect(sentence.lineSlots.length).toBe(0);
        expect(sentence.words.length).toBe(9);

        const [aeiou, bjtth, phwhgh, chkshy, dlrz, cq, gnvqu, hpwx, fmsng] = sentence.words;

        expect(aeiou.text).toBe('aeiou');
        expect(aeiou.lineSlots.length).toBe(0);
        expect(aeiou.letters.length).toBe(5);

        expect(bjtth.text).toBe('bjtth');
        expect(bjtth.lineSlots.length).toBe(0);
        expect(bjtth.letters.length).toBe(4);

        expect(phwhgh.text).toBe('phwhgh');
        expect(phwhgh.lineSlots.length).toBe(0);
        expect(phwhgh.letters.length).toBe(3);

        expect(chkshy.text).toBe('chkshy');
        expect(chkshy.lineSlots.length).toBe(0);
        expect(chkshy.letters.length).toBe(4);

        expect(dlrz.text).toBe('dlrz');
        expect(dlrz.lineSlots.length).toBe(0);
        expect(dlrz.letters.length).toBe(4);

        expect(cq.text).toBe('cq');
        expect(cq.lineSlots.length).toBe(0);
        expect(cq.letters.length).toBe(2);

        expect(gnvqu.text).toBe('gnvqu');
        expect(gnvqu.lineSlots.length).toBe(0);
        expect(gnvqu.letters.length).toBe(4);

        expect(hpwx.text).toBe('hpwx');
        expect(hpwx.lineSlots.length).toBe(0);
        expect(hpwx.letters.length).toBe(4);

        expect(fmsng.text).toBe('fmsng');
        expect(fmsng.lineSlots.length).toBe(0);
        expect(fmsng.letters.length).toBe(4);
    });

    interface VocalExpectations {
        lineSlots: number;
        placement: VocalPlacement;
        decoration: VocalDecoration;
    }

    describe('Vocals', () => {
        const expectVocal = (text: string, expectations: VocalExpectations) => {
            const { textPart: sentence } = convertTextToSentence(text);
            const vocal = sentence.words.at(0)!.letters.at(0)! as Vocal;

            expect(vocal.text).toBe(text);
            expect(vocal.lineSlots.length).toBe(expectations.lineSlots);
            expect(vocal.placement).toBe(expectations.placement);
            expect(vocal.decoration).toBe(expectations.decoration);
        };

        it('should convert "a"', () =>
            expectVocal('a', { lineSlots: 0, placement: VocalPlacement.Outside, decoration: VocalDecoration.None }));

        it('should convert "e"', () =>
            expectVocal('e', { lineSlots: 0, placement: VocalPlacement.OnLine, decoration: VocalDecoration.None }));

        it('should convert "i"', () =>
            expectVocal('i', {
                lineSlots: 1,
                placement: VocalPlacement.OnLine,
                decoration: VocalDecoration.LineInside,
            }));

        it('should convert "o"', () =>
            expectVocal('o', {
                lineSlots: 0,
                placement: VocalPlacement.Inside,
                decoration: VocalDecoration.None,
            }));

        it('should convert "u"', () =>
            expectVocal('u', {
                lineSlots: 1,
                placement: VocalPlacement.OnLine,
                decoration: VocalDecoration.LineOutside,
            }));
    });

    interface ConsonantExpectations {
        lineSlots: number;
        dots: number;
        placement: ConsonantPlacement;
        decoration: ConsonantDecoration;
    }

    describe('Consonants', () => {
        const expectConsonant = (text: string, expectations: ConsonantExpectations) => {
            const { textPart: sentence } = convertTextToSentence(text);
            const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

            expect(consonant.text).toBe(text);
            expect(consonant.lineSlots.length).toBe(expectations.lineSlots);
            expect(consonant.dots.length).toBe(expectations.dots);
            expect(consonant.vocal).not.toBeDefined();
            expect(consonant.placement).toBe(expectations.placement);
            expect(consonant.decoration).toBe(expectations.decoration);
        };

        describe('No decoration', () => {
            it('should convert "b"', () =>
                expectConsonant('b', {
                    dots: 0,
                    lineSlots: 0,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.None,
                }));

            it('should convert "j"', () =>
                expectConsonant('j', {
                    dots: 0,
                    lineSlots: 0,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.None,
                }));

            it('should convert "t"', () =>
                expectConsonant('t', {
                    dots: 0,
                    lineSlots: 0,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.None,
                }));

            it('should convert "th"', () =>
                expectConsonant('th', {
                    dots: 0,
                    lineSlots: 0,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.None,
                }));
        });

        describe('Single dot', () => {
            it('should convert "ph"', () =>
                expectConsonant('ph', {
                    dots: 1,
                    lineSlots: 0,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.SingleDot,
                }));

            it('should convert "wh"', () =>
                expectConsonant('wh', {
                    dots: 1,
                    lineSlots: 0,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.SingleDot,
                }));

            it('should convert "gh"', () =>
                expectConsonant('gh', {
                    dots: 1,
                    lineSlots: 0,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.SingleDot,
                }));
        });

        describe('Double dot', () => {
            it('should convert "ch"', () =>
                expectConsonant('ch', {
                    dots: 2,
                    lineSlots: 0,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.DoubleDot,
                }));

            it('should convert "k"', () =>
                expectConsonant('k', {
                    dots: 2,
                    lineSlots: 0,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.DoubleDot,
                }));

            it('should convert "sh"', () =>
                expectConsonant('sh', {
                    dots: 2,
                    lineSlots: 0,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.DoubleDot,
                }));

            it('should convert "y"', () =>
                expectConsonant('y', {
                    dots: 2,
                    lineSlots: 0,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.DoubleDot,
                }));
        });

        describe('Triple dot', () => {
            it('should convert "d"', () =>
                expectConsonant('d', {
                    dots: 3,
                    lineSlots: 0,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.TripleDot,
                }));

            it('should convert "l"', () =>
                expectConsonant('l', {
                    dots: 3,
                    lineSlots: 0,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.TripleDot,
                }));

            it('should convert "r"', () =>
                expectConsonant('r', {
                    dots: 3,
                    lineSlots: 0,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.TripleDot,
                }));

            it('should convert "z"', () =>
                expectConsonant('z', {
                    dots: 3,
                    lineSlots: 0,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.TripleDot,
                }));
        });

        describe('Quadruple dot', () => {
            it('should convert "c"', () =>
                expectConsonant('c', {
                    dots: 4,
                    lineSlots: 0,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.QuadrupleDot,
                }));

            it('should convert "q"', () =>
                expectConsonant('q', {
                    dots: 4,
                    lineSlots: 0,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.QuadrupleDot,
                }));
        });

        describe('Single line', () => {
            it('should convert "g"', () =>
                expectConsonant('g', {
                    dots: 0,
                    lineSlots: 1,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.SingleLine,
                }));

            it('should convert "n"', () =>
                expectConsonant('n', {
                    dots: 0,
                    lineSlots: 1,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.SingleLine,
                }));

            it('should convert "v"', () =>
                expectConsonant('v', {
                    dots: 0,
                    lineSlots: 1,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.SingleLine,
                }));

            it('should convert "qu"', () =>
                expectConsonant('qu', {
                    dots: 0,
                    lineSlots: 1,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.SingleLine,
                }));
        });

        describe('Double line', () => {
            it('should convert "h"', () =>
                expectConsonant('h', {
                    dots: 0,
                    lineSlots: 2,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.DoubleLine,
                }));

            it('should convert "p"', () =>
                expectConsonant('p', {
                    dots: 0,
                    lineSlots: 2,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.DoubleLine,
                }));

            it('should convert "w"', () =>
                expectConsonant('w', {
                    dots: 0,
                    lineSlots: 2,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.DoubleLine,
                }));

            it('should convert "x"', () =>
                expectConsonant('x', {
                    dots: 0,
                    lineSlots: 2,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.DoubleLine,
                }));
        });

        describe('Triple line', () => {
            it('should convert "f"', () =>
                expectConsonant('f', {
                    dots: 0,
                    lineSlots: 3,
                    placement: ConsonantPlacement.DeepCut,
                    decoration: ConsonantDecoration.TripleLine,
                }));

            it('should convert "m"', () =>
                expectConsonant('m', {
                    dots: 0,
                    lineSlots: 3,
                    placement: ConsonantPlacement.Inside,
                    decoration: ConsonantDecoration.TripleLine,
                }));

            it('should convert "s"', () =>
                expectConsonant('s', {
                    dots: 0,
                    lineSlots: 3,
                    placement: ConsonantPlacement.ShallowCut,
                    decoration: ConsonantDecoration.TripleLine,
                }));

            it('should convert "ng"', () =>
                expectConsonant('ng', {
                    dots: 0,
                    lineSlots: 3,
                    placement: ConsonantPlacement.OnLine,
                    decoration: ConsonantDecoration.TripleLine,
                }));
        });

        describe('Nested vocal', () => {
            const expectNested = (
                consonantText: string,
                consonantExpectations: ConsonantExpectations,
                vocalText: string,
                vocalExpectations: VocalExpectations
            ) => {
                const { textPart: sentence } = convertTextToSentence(consonantText + vocalText);
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe(consonantText);
                expect(consonant.lineSlots.length).toBe(consonantExpectations.lineSlots);
                expect(consonant.dots.length).toBe(consonantExpectations.dots);
                expect(consonant.placement).toBe(consonantExpectations.placement);
                expect(consonant.decoration).toBe(consonantExpectations.decoration);
                expect(consonant.vocal).toBeDefined();

                const vocal = consonant.vocal!;

                expect(vocal.text).toBe(vocalText);
                expect(vocal.lineSlots.length).toBe(vocalExpectations.lineSlots);
                expect(vocal.placement).toBe(vocalExpectations.placement);
                expect(vocal.decoration).toBe(vocalExpectations.decoration);
            };

            it('should convert "ba"', () =>
                expectNested(
                    'b',
                    {
                        dots: 0,
                        lineSlots: 0,
                        placement: ConsonantPlacement.DeepCut,
                        decoration: ConsonantDecoration.None,
                    },
                    'a',
                    { lineSlots: 0, placement: VocalPlacement.Outside, decoration: VocalDecoration.None }
                ));

            it('should convert "ke"', () =>
                expectNested(
                    'k',
                    {
                        dots: 2,
                        lineSlots: 0,
                        placement: ConsonantPlacement.Inside,
                        decoration: ConsonantDecoration.DoubleDot,
                    },
                    'e',
                    { lineSlots: 0, placement: VocalPlacement.OnLine, decoration: VocalDecoration.None }
                ));

            it('should convert "ri"', () =>
                expectNested(
                    'r',
                    {
                        dots: 3,
                        lineSlots: 0,
                        placement: ConsonantPlacement.ShallowCut,
                        decoration: ConsonantDecoration.TripleDot,
                    },
                    'i',
                    { lineSlots: 1, placement: VocalPlacement.OnLine, decoration: VocalDecoration.LineInside }
                ));

            it('should convert "quu"', () =>
                expectNested(
                    'qu',
                    {
                        dots: 0,
                        lineSlots: 1,
                        placement: ConsonantPlacement.OnLine,
                        decoration: ConsonantDecoration.SingleLine,
                    },
                    'u',
                    { lineSlots: 1, placement: VocalPlacement.OnLine, decoration: VocalDecoration.LineOutside }
                ));

            it('should convert "wo"', () =>
                expectNested(
                    'w',
                    {
                        dots: 0,
                        lineSlots: 2,
                        placement: ConsonantPlacement.ShallowCut,
                        decoration: ConsonantDecoration.DoubleLine,
                    },
                    'o',
                    { lineSlots: 0, placement: VocalPlacement.Inside, decoration: VocalDecoration.None }
                ));
        });
    });
});
