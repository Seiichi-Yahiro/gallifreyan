import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
import { updateSentence } from '../state/ImageState';
import { Consonant, Vocal } from '../state/ImageTypes';
import { render } from '../utils/TestUtils';
import { SVGVocal, SVGConsonant } from './SVGLetter';

describe('SVG Letter', () => {
    describe('SVG Vocal', () => {
        const SetVocal: React.FunctionComponent<{ text: string }> = ({ text }) => {
            const dispatch = useDispatch();
            const vocal = useRedux((state) => state.image.sentence.words.at(0)?.letters.at(0) as Vocal);
            useEffect(() => {
                dispatch(updateSentence(text));
            }, []);

            return <svg>{vocal && <SVGVocal {...vocal} />}</svg>;
        };

        const expectVocal = (text: string, countLineSlots: number) => {
            const { container } = render(<SetVocal text={text} />);

            const vocals = container.querySelectorAll('.group-vocal');
            expect(vocals.length).toBe(1);

            const vocalCircle = vocals.item(0).querySelector('circle')!;
            expect(vocalCircle.getAttribute('fill')).toBe('transparent');
            expect(vocalCircle.getAttribute('stroke')).toBe('inherit');

            const dots = container.querySelectorAll('.group-dot');
            expect(dots.length).toBe(0);

            const lineSlots = container.querySelectorAll('.group-line-slot');
            expect(lineSlots.length).toBe(countLineSlots);
        };

        it('should render "a"', () => expectVocal('a', 0));
        it('should render "e"', () => expectVocal('e', 0));
        it('should render "o"', () => expectVocal('o', 0));
        it('should render "i"', () => expectVocal('i', 1));
        it('should render "u"', () => expectVocal('u', 1));
    });

    describe('SVG Consonant', () => {
        const SetConsonant: React.FunctionComponent<{ text: string }> = ({ text }) => {
            const dispatch = useDispatch();
            const consonant = useRedux((state) => state.image.sentence.words.at(0)?.letters.at(0) as Consonant);
            useEffect(() => {
                dispatch(updateSentence(text));
            }, []);

            return <svg>{consonant && <SVGConsonant {...consonant} parentRadius={100} />}</svg>;
        };

        interface Expectations {
            arcs: number;
            dots: number;
            lineSlots: number;
            vocals: number;
            stroke: string;
        }

        const expectConsonant = (text: string, expectations: Expectations) => {
            const { container } = render(<SetConsonant text={text} />);

            const consonants = container.querySelectorAll('.group-consonant');
            expect(consonants.length).toBe(1);

            const consonantCircle = consonants.item(0).querySelector('circle')!;
            expect(consonantCircle.getAttribute('fill')).toBe('transparent');
            expect(consonantCircle.getAttribute('stroke')).toBe(expectations.stroke);

            const arcs = container.querySelectorAll('.group-consonant__arc');
            expect(arcs.length).toBe(expectations.arcs);

            arcs.forEach((arc) => {
                const mask = arc.querySelector('mask')!;
                const consonantCutMask = mask.querySelector('circle')!;
                expect(consonantCutMask.getAttribute('fill')).toBe('#000000');
                expect(consonantCutMask.getAttribute('stroke')).toBe('#ffffff');

                const arc_circle: SVGCircleElement = arc.querySelector('mask + circle')!;
                expect(arc_circle.getAttribute('fill')).toBe('inherit');
                expect(arc_circle.getAttribute('stroke')).toBe('inherit');
                expect(arc_circle.style.pointerEvents).toBe('none');

                expect(arc_circle.getAttribute('mask')).toBe('url(#' + mask.id + ')');
            });

            const dots = container.querySelectorAll('.group-dot');
            expect(dots.length).toBe(expectations.dots);

            const lineSlots = container.querySelectorAll('.group-line-slot');
            expect(lineSlots.length).toBe(expectations.lineSlots);

            const vocals = container.querySelectorAll('.group-vocal');
            expect(vocals.length).toBe(expectations.vocals);
        };

        describe('No decoration', () => {
            it('should render "b"', () =>
                expectConsonant('b', { arcs: 1, dots: 0, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "j"', () =>
                expectConsonant('j', { arcs: 0, dots: 0, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
            it('should render "t"', () =>
                expectConsonant('t', { arcs: 1, dots: 0, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "th"', () =>
                expectConsonant('th', { arcs: 0, dots: 0, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
        });

        describe('Single dot', () => {
            it('should render "ph"', () =>
                expectConsonant('ph', { arcs: 0, dots: 1, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
            it('should render "wh"', () =>
                expectConsonant('wh', { arcs: 1, dots: 1, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "gh"', () =>
                expectConsonant('gh', { arcs: 0, dots: 1, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
        });

        describe('Double dot', () => {
            it('should render "ch"', () =>
                expectConsonant('ch', { arcs: 1, dots: 2, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "k"', () =>
                expectConsonant('k', { arcs: 0, dots: 2, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
            it('should render "sh"', () =>
                expectConsonant('sh', { arcs: 1, dots: 2, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "y"', () =>
                expectConsonant('y', { arcs: 0, dots: 2, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
        });

        describe('Triple dot', () => {
            it('should render "d"', () =>
                expectConsonant('d', { arcs: 1, dots: 3, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "l"', () =>
                expectConsonant('l', { arcs: 0, dots: 3, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
            it('should render "r"', () =>
                expectConsonant('r', { arcs: 1, dots: 3, lineSlots: 0, vocals: 0, stroke: 'none' }));
            it('should render "z"', () =>
                expectConsonant('z', { arcs: 0, dots: 3, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
        });

        describe('Quadruple dot', () => {
            it('should render "c"', () =>
                expectConsonant('c', { arcs: 0, dots: 4, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
            it('should render "q"', () =>
                expectConsonant('q', { arcs: 0, dots: 4, lineSlots: 0, vocals: 0, stroke: 'inherit' }));
        });

        describe('Single line', () => {
            it('should render "g"', () =>
                expectConsonant('g', { arcs: 1, dots: 0, lineSlots: 1, vocals: 0, stroke: 'none' }));
            it('should render "n"', () =>
                expectConsonant('n', { arcs: 0, dots: 0, lineSlots: 1, vocals: 0, stroke: 'inherit' }));
            it('should render "v"', () =>
                expectConsonant('v', { arcs: 1, dots: 0, lineSlots: 1, vocals: 0, stroke: 'none' }));
            it('should render "qu"', () =>
                expectConsonant('qu', { arcs: 0, dots: 0, lineSlots: 1, vocals: 0, stroke: 'inherit' }));
        });

        describe('Double line', () => {
            it('should render "h"', () =>
                expectConsonant('h', { arcs: 1, dots: 0, lineSlots: 2, vocals: 0, stroke: 'none' }));
            it('should render "p"', () =>
                expectConsonant('p', { arcs: 0, dots: 0, lineSlots: 2, vocals: 0, stroke: 'inherit' }));
            it('should render "w"', () =>
                expectConsonant('w', { arcs: 1, dots: 0, lineSlots: 2, vocals: 0, stroke: 'none' }));
            it('should render "x"', () =>
                expectConsonant('x', { arcs: 0, dots: 0, lineSlots: 2, vocals: 0, stroke: 'inherit' }));
        });

        describe('Triple line', () => {
            it('should render "f"', () =>
                expectConsonant('f', { arcs: 1, dots: 0, lineSlots: 3, vocals: 0, stroke: 'none' }));
            it('should render "m"', () =>
                expectConsonant('m', { arcs: 0, dots: 0, lineSlots: 3, vocals: 0, stroke: 'inherit' }));
            it('should render "s"', () =>
                expectConsonant('s', { arcs: 1, dots: 0, lineSlots: 3, vocals: 0, stroke: 'none' }));
            it('should render "ng"', () =>
                expectConsonant('ng', { arcs: 0, dots: 0, lineSlots: 3, vocals: 0, stroke: 'inherit' }));
        });

        describe('Nested vocal', () => {
            it('should render "ba', () =>
                expectConsonant('ba', { arcs: 1, dots: 0, lineSlots: 0, vocals: 1, stroke: 'none' }));
            it('should render "ke', () =>
                expectConsonant('ke', { arcs: 0, dots: 2, lineSlots: 0, vocals: 1, stroke: 'inherit' }));
            it('should render "ri', () =>
                expectConsonant('ri', { arcs: 1, dots: 3, lineSlots: 1, vocals: 1, stroke: 'none' }));
            it('should render "quu', () =>
                expectConsonant('quu', { arcs: 0, dots: 0, lineSlots: 2, vocals: 1, stroke: 'inherit' }));
            it('should render "wo', () =>
                expectConsonant('wo', { arcs: 1, dots: 0, lineSlots: 2, vocals: 1, stroke: 'none' }));
        });
    });
});
