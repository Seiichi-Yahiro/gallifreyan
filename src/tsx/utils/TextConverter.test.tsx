import {
    Consonant,
    ConsonantDecoration,
    ConsonantPlacement,
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

    describe('Vocals', () => {
        it('should convert "a"', () => {
            const { textPart: sentence } = convertTextToSentence('a');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('a');
            expect(vocal.lineSlots.length).toBe(0);
            expect(vocal.placement).toBe(VocalPlacement.Outside);
            expect(vocal.decoration).toBe(VocalDecoration.None);
        });

        it('should convert "e"', () => {
            const { textPart: sentence } = convertTextToSentence('e');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('e');
            expect(vocal.lineSlots.length).toBe(0);
            expect(vocal.placement).toBe(VocalPlacement.OnLine);
            expect(vocal.decoration).toBe(VocalDecoration.None);
        });

        it('should convert "i"', () => {
            const { textPart: sentence } = convertTextToSentence('i');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('i');
            expect(vocal.lineSlots.length).toBe(1);
            expect(vocal.placement).toBe(VocalPlacement.OnLine);
            expect(vocal.decoration).toBe(VocalDecoration.LineInside);
        });

        it('should convert "o"', () => {
            const { textPart: sentence } = convertTextToSentence('o');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('o');
            expect(vocal.lineSlots.length).toBe(0);
            expect(vocal.placement).toBe(VocalPlacement.Inside);
            expect(vocal.decoration).toBe(VocalDecoration.None);
        });

        it('should convert "u"', () => {
            const { textPart: sentence } = convertTextToSentence('u');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('u');
            expect(vocal.lineSlots.length).toBe(1);
            expect(vocal.placement).toBe(VocalPlacement.OnLine);
            expect(vocal.decoration).toBe(VocalDecoration.LineOutside);
        });
    });

    describe('Consonants', () => {
        describe('No decoration', () => {
            it('should convert "b"', () => {
                const { textPart: sentence } = convertTextToSentence('b');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('b');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.None);
            });

            it('should convert "j"', () => {
                const { textPart: sentence } = convertTextToSentence('j');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('j');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.None);
            });

            it('should convert "t"', () => {
                const { textPart: sentence } = convertTextToSentence('t');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('t');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.None);
            });

            it('should convert "th"', () => {
                const { textPart: sentence } = convertTextToSentence('th');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('th');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.None);
            });
        });

        describe('Single dot', () => {
            it('should convert "ph"', () => {
                const { textPart: sentence } = convertTextToSentence('ph');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('ph');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(1);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleDot);
            });

            it('should convert "wh"', () => {
                const { textPart: sentence } = convertTextToSentence('wh');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('wh');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(1);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleDot);
            });

            it('should convert "gh"', () => {
                const { textPart: sentence } = convertTextToSentence('gh');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('gh');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(1);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleDot);
            });
        });

        describe('Double dot', () => {
            it('should convert "ch"', () => {
                const { textPart: sentence } = convertTextToSentence('ch');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('ch');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleDot);
            });

            it('should convert "k"', () => {
                const { textPart: sentence } = convertTextToSentence('k');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('k');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleDot);
            });

            it('should convert "sh"', () => {
                const { textPart: sentence } = convertTextToSentence('sh');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('sh');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleDot);
            });

            it('should convert "y"', () => {
                const { textPart: sentence } = convertTextToSentence('y');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('y');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleDot);
            });
        });

        describe('Triple dot', () => {
            it('should convert "d"', () => {
                const { textPart: sentence } = convertTextToSentence('d');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('d');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleDot);
            });

            it('should convert "l"', () => {
                const { textPart: sentence } = convertTextToSentence('l');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('l');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleDot);
            });

            it('should convert "r"', () => {
                const { textPart: sentence } = convertTextToSentence('r');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('r');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleDot);
            });

            it('should convert "z"', () => {
                const { textPart: sentence } = convertTextToSentence('z');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('z');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleDot);
            });
        });

        describe('Quadruple dot', () => {
            it('should convert "c"', () => {
                const { textPart: sentence } = convertTextToSentence('c');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('c');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(4);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.QuadrupleDot);
            });

            it('should convert "q"', () => {
                const { textPart: sentence } = convertTextToSentence('q');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('q');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(4);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.QuadrupleDot);
            });
        });

        describe('Single line', () => {
            it('should convert "g"', () => {
                const { textPart: sentence } = convertTextToSentence('g');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('g');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleLine);
            });

            it('should convert "n"', () => {
                const { textPart: sentence } = convertTextToSentence('n');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('n');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleLine);
            });

            it('should convert "v"', () => {
                const { textPart: sentence } = convertTextToSentence('v');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('v');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleLine);
            });

            it('should convert "qu"', () => {
                const { textPart: sentence } = convertTextToSentence('qu');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('qu');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.SingleLine);
            });
        });

        describe('Double line', () => {
            it('should convert "h"', () => {
                const { textPart: sentence } = convertTextToSentence('h');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('h');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleLine);
            });

            it('should convert "p"', () => {
                const { textPart: sentence } = convertTextToSentence('p');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('p');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleLine);
            });

            it('should convert "w"', () => {
                const { textPart: sentence } = convertTextToSentence('w');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('w');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleLine);
            });

            it('should convert "x"', () => {
                const { textPart: sentence } = convertTextToSentence('x');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('x');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.DoubleLine);
            });
        });

        describe('Triple line', () => {
            it('should convert "f"', () => {
                const { textPart: sentence } = convertTextToSentence('f');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('f');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleLine);
            });

            it('should convert "m"', () => {
                const { textPart: sentence } = convertTextToSentence('m');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('m');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.Inside);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleLine);
            });

            it('should convert "s"', () => {
                const { textPart: sentence } = convertTextToSentence('s');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('s');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.ShallowCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleLine);
            });

            it('should convert "ng"', () => {
                const { textPart: sentence } = convertTextToSentence('ng');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('ng');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
                expect(consonant.placement).toBe(ConsonantPlacement.OnLine);
                expect(consonant.decoration).toBe(ConsonantDecoration.TripleLine);
            });
        });

        describe('Nested vocal', () => {
            it('should convert "ba"', () => {
                const { circles, lineSlots, textPart: sentence } = convertTextToSentence('ba');

                expect(circles.length).toBe(4);
                expect(lineSlots.length).toBe(0);

                expect(sentence.text).toBe('ba');
                expect(sentence.lineSlots.length).toBe(0);
                expect(sentence.words.length).toBe(1);

                const word = sentence.words.at(0)!;

                expect(word.text).toBe('ba');
                expect(word.lineSlots.length).toBe(0);
                expect(word.letters.length).toBe(1);

                const consonant = word.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('b');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeTruthy();
                expect(consonant.placement).toBe(ConsonantPlacement.DeepCut);
                expect(consonant.decoration).toBe(ConsonantDecoration.None);

                const vocal = consonant.vocal.unwrap();

                expect(vocal.text).toBe('a');
                expect(vocal.lineSlots.length).toBe(0);
                expect(vocal.placement).toBe(VocalPlacement.Outside);
                expect(vocal.decoration).toBe(VocalDecoration.None);
            });
        });
    });
});
