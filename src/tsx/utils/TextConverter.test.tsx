import { Consonant } from '../state/ImageTypes';
import { convertTextToSentence, splitWordToChars } from './TextConverter';

describe('TextConverter', () => {
    it('should split lower case word', () => {
        const result = splitWordToChars('aeioubjtthchkshydlrzgnvquhpwxfmsng');
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
            'ch',
            'k',
            'sh',
            'y',
            'd',
            'l',
            'r',
            'z',
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
        const result = splitWordToChars('AEIOUBJTTHCHKSHYDLRZGNVQUHPWXFMSNG');
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
            'CH',
            'K',
            'SH',
            'Y',
            'D',
            'L',
            'R',
            'Z',
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
        const result = splitWordToChars('tHThcHChsHShqUQunGNg');
        expect(result).toEqual(['tH', 'Th', 'cH', 'Ch', 'sH', 'Sh', 'qU', 'Qu', 'nG', 'Ng']);
    });

    it('should convert text to circles', () => {
        const { circles } = convertTextToSentence('aeiou bjtth chkshy dlrz gnvqu hpwx fmsng');

        // 5 vocals
        // 24 consonants
        // 20 dots
        // 7 words
        // 1 sentence
        expect(circles.length).toBe(57);
    });

    it('should convert text to line slots', () => {
        const { lineSlots } = convertTextToSentence('aeiou bjtth chkshy dlrz gnvqu hpwx fmsng');

        // 2 vocals
        // 24 consonants
        expect(lineSlots.length).toBe(26);
    });

    it('should convert text to sentence', () => {
        const { textPart: sentence } = convertTextToSentence('aeiou bjtth chkshy dlrz gnvqu hpwx fmsng');

        expect(sentence.text).toBe('aeiou bjtth chkshy dlrz gnvqu hpwx fmsng');
        expect(sentence.lineSlots.length).toBe(0);
        expect(sentence.words.length).toBe(7);

        const [aeiou, bjtth, chkshy, dlrz, gnvqu, hpwx, fmsng] = sentence.words;

        expect(aeiou.text).toBe('aeiou');
        expect(aeiou.lineSlots.length).toBe(0);
        expect(aeiou.letters.length).toBe(5);

        expect(bjtth.text).toBe('bjtth');
        expect(bjtth.lineSlots.length).toBe(0);
        expect(bjtth.letters.length).toBe(4);

        expect(chkshy.text).toBe('chkshy');
        expect(chkshy.lineSlots.length).toBe(0);
        expect(chkshy.letters.length).toBe(4);

        expect(dlrz.text).toBe('dlrz');
        expect(dlrz.lineSlots.length).toBe(0);
        expect(dlrz.letters.length).toBe(4);

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
        });

        it('should convert "e"', () => {
            const { textPart: sentence } = convertTextToSentence('e');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('e');
            expect(vocal.lineSlots.length).toBe(0);
        });

        it('should convert "i"', () => {
            const { textPart: sentence } = convertTextToSentence('i');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('i');
            expect(vocal.lineSlots.length).toBe(1);
        });

        it('should convert "o"', () => {
            const { textPart: sentence } = convertTextToSentence('o');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('o');
            expect(vocal.lineSlots.length).toBe(0);
        });

        it('should convert "u"', () => {
            const { textPart: sentence } = convertTextToSentence('u');
            const vocal = sentence.words.at(0)!.letters.at(0)!;

            expect((vocal as Consonant).dots).not.toBeDefined();
            expect(vocal.text).toBe('u');
            expect(vocal.lineSlots.length).toBe(1);
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
            });

            it('should convert "j"', () => {
                const { textPart: sentence } = convertTextToSentence('j');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('j');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "t"', () => {
                const { textPart: sentence } = convertTextToSentence('t');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('t');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "th"', () => {
                const { textPart: sentence } = convertTextToSentence('th');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('th');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
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
            });

            it('should convert "k"', () => {
                const { textPart: sentence } = convertTextToSentence('k');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('k');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "sh"', () => {
                const { textPart: sentence } = convertTextToSentence('sh');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('sh');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "y"', () => {
                const { textPart: sentence } = convertTextToSentence('y');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('y');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(2);
                expect(consonant.vocal.isSome()).toBeFalsy();
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
            });

            it('should convert "l"', () => {
                const { textPart: sentence } = convertTextToSentence('l');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('l');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "r"', () => {
                const { textPart: sentence } = convertTextToSentence('r');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('r');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "z"', () => {
                const { textPart: sentence } = convertTextToSentence('z');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('z');
                expect(consonant.lineSlots.length).toBe(0);
                expect(consonant.dots.length).toBe(3);
                expect(consonant.vocal.isSome()).toBeFalsy();
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
            });

            it('should convert "n"', () => {
                const { textPart: sentence } = convertTextToSentence('n');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('n');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "v"', () => {
                const { textPart: sentence } = convertTextToSentence('v');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('v');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "qu"', () => {
                const { textPart: sentence } = convertTextToSentence('qu');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('qu');
                expect(consonant.lineSlots.length).toBe(1);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
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
            });

            it('should convert "p"', () => {
                const { textPart: sentence } = convertTextToSentence('p');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('p');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "w"', () => {
                const { textPart: sentence } = convertTextToSentence('w');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('w');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "x"', () => {
                const { textPart: sentence } = convertTextToSentence('x');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('x');
                expect(consonant.lineSlots.length).toBe(2);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
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
            });

            it('should convert "m"', () => {
                const { textPart: sentence } = convertTextToSentence('m');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('m');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "s"', () => {
                const { textPart: sentence } = convertTextToSentence('s');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('s');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
            });

            it('should convert "ng"', () => {
                const { textPart: sentence } = convertTextToSentence('ng');
                const consonant = sentence.words.at(0)!.letters.at(0)! as Consonant;

                expect(consonant.text).toBe('ng');
                expect(consonant.lineSlots.length).toBe(3);
                expect(consonant.dots.length).toBe(0);
                expect(consonant.vocal.isSome()).toBeFalsy();
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

                const vocal = consonant.vocal.unwrap();

                expect(vocal.text).toBe('a');
                expect(vocal.lineSlots.length).toBe(0);
            });
        });
    });
});
