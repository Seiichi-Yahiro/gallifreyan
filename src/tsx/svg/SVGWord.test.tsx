import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { updateSentence } from '../state/ImageState';
import { render } from '../utils/TestUtils';
import SVGWord from './SVGWord';

describe('SVG Word', () => {
    const SetWord: React.FunctionComponent<{ text: string }> = ({ text }) => {
        const dispatch = useAppDispatch();
        const word = useRedux((state) => state.image.sentence.words.at(0));
        useEffect(() => {
            dispatch(updateSentence(text));
        }, []);

        return <svg>{word && <SVGWord {...word} />}</svg>;
    };

    interface Expectations {
        consonants: number;
        vocals: number;
        maskCircles: number;
    }

    const expectWord = (text: string, expectations: Expectations) => {
        const { container } = render(<SetWord text={text} />);

        const words = container.querySelectorAll('.group-word');
        expect(words.length).toBe(1);

        const mask = container.querySelector('.group-word > mask')!;
        const maskCircles = mask.querySelectorAll('circle');
        expect(maskCircles.length).toBe(expectations.maskCircles + 1);

        const wordCircle = container.querySelector('.group-word > mask + circle')!;
        expect(wordCircle.getAttribute('fill')).toBe('transparent');
        expect(wordCircle.getAttribute('stroke')).toBe('inherit');

        expect(wordCircle.getAttribute('mask')).toBe('url(#' + mask.id + ')');

        const consonants = container.querySelectorAll('.group-consonant');
        expect(consonants.length).toBe(expectations.consonants);

        const vocals = container.querySelectorAll('.group-vocal');
        expect(vocals.length).toBe(expectations.vocals);
    };

    describe('Vocals', () => {
        it('should render "a"', () => expectWord('a', { consonants: 0, vocals: 1, maskCircles: 0 }));
        it('should render "e"', () => expectWord('e', { consonants: 0, vocals: 1, maskCircles: 0 }));
        it('should render "o"', () => expectWord('o', { consonants: 0, vocals: 1, maskCircles: 0 }));
        it('should render "i"', () => expectWord('i', { consonants: 0, vocals: 1, maskCircles: 0 }));
        it('should render "u"', () => expectWord('u', { consonants: 0, vocals: 1, maskCircles: 0 }));
    });

    describe('Consonants', () => {
        describe('No decoration', () => {
            it('should render "b"', () => expectWord('b', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "j"', () => expectWord('j', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "t"', () => expectWord('t', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "th"', () => expectWord('th', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Single dot', () => {
            it('should render "ph"', () => expectWord('ph', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "wh"', () => expectWord('wh', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "gh"', () => expectWord('gh', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Double dot', () => {
            it('should render "ch"', () => expectWord('ch', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "k"', () => expectWord('k', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "sh"', () => expectWord('sh', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "y"', () => expectWord('y', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Triple dot', () => {
            it('should render "d"', () => expectWord('d', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "l"', () => expectWord('l', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "r"', () => expectWord('r', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "z"', () => expectWord('z', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Quadruple dot', () => {
            it('should render "c"', () => expectWord('c', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "q"', () => expectWord('q', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Single line', () => {
            it('should render "g"', () => expectWord('g', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "n"', () => expectWord('n', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "v"', () => expectWord('v', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "qu"', () => expectWord('qu', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Double line', () => {
            it('should render "h"', () => expectWord('h', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "p"', () => expectWord('p', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "w"', () => expectWord('w', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "x"', () => expectWord('x', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });

        describe('Triple line', () => {
            it('should render "f"', () => expectWord('f', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "m"', () => expectWord('m', { consonants: 1, vocals: 0, maskCircles: 0 }));
            it('should render "s"', () => expectWord('s', { consonants: 1, vocals: 0, maskCircles: 1 }));
            it('should render "ng"', () => expectWord('ng', { consonants: 1, vocals: 0, maskCircles: 0 }));
        });
    });

    describe('Mixed consonants and vocals', () => {
        it('should render "word"', () => expectWord('word', { consonants: 3, vocals: 1, maskCircles: 3 }));
        it('should render "quute"', () => expectWord('quute', { consonants: 2, vocals: 2, maskCircles: 1 }));
        it('should render "jooloo"', () => expectWord('jooloo', { consonants: 2, vocals: 4, maskCircles: 0 }));
        it('should render "rrrrr"', () => expectWord('rrrrr', { consonants: 5, vocals: 0, maskCircles: 5 }));
        it('should render "aeiou"', () => expectWord('aeiou', { consonants: 0, vocals: 5, maskCircles: 0 }));
    });
});
