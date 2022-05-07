import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
import { updateSentenceAction } from '../state/ImageStore';
import { Consonant, Vocal } from '../state/ImageTypes';
import { render } from '../utils/TestUtils';
import { SVGVocal, SVGConsonant } from './SVGLetter';

describe('SVG Letter', () => {
    describe('SVG Vocal', () => {
        const SetVocal: React.FunctionComponent<{ text: string }> = ({ text }) => {
            const dispatch = useDispatch();
            const vocal = useRedux((state) => state.image.sentence.words.at(0)?.letters.at(0) as Vocal);
            useEffect(() => {
                dispatch(updateSentenceAction(text));
            }, []);

            return <svg>{vocal && <SVGVocal {...vocal} fill="#000000" stroke="#000000" />}</svg>;
        };

        it('should render "a"', () => {
            const { container } = render(<SetVocal text={'a'} />);

            const vocals = container.querySelectorAll('svg > g > circle');
            expect(vocals.length).toBe(1);

            const groups = container.querySelectorAll('g');
            expect(groups.length).toBe(1);

            const circles = container.querySelectorAll('circle');
            expect(circles.length).toBe(1);

            const lines = container.querySelectorAll('line');
            expect(lines.length).toBe(0);
        });

        it('should render "e"', () => {
            const { container } = render(<SetVocal text={'e'} />);

            const vocals = container.querySelectorAll('svg > g > circle');
            expect(vocals.length).toBe(1);

            const groups = container.querySelectorAll('g');
            expect(groups.length).toBe(1);

            const circles = container.querySelectorAll('circle');
            expect(circles.length).toBe(1);

            const lines = container.querySelectorAll('line');
            expect(lines.length).toBe(0);
        });

        it('should render "o"', () => {
            const { container } = render(<SetVocal text={'o'} />);

            const vocals = container.querySelectorAll('svg > g > circle');
            expect(vocals.length).toBe(1);

            const groups = container.querySelectorAll('g');
            expect(groups.length).toBe(1);

            const circles = container.querySelectorAll('circle');
            expect(circles.length).toBe(1);

            const lines = container.querySelectorAll('line');
            expect(lines.length).toBe(0);
        });

        it('should render "i"', () => {
            const { container } = render(<SetVocal text={'i'} />);

            const vocals = container.querySelectorAll('svg > g > circle');
            expect(vocals.length).toBe(1);

            const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
            expect(lineSlot.length).toBe(1);

            const groups = container.querySelectorAll('g');
            expect(groups.length).toBe(2);

            const circles = container.querySelectorAll('circle');
            expect(circles.length).toBe(3);

            const lines = container.querySelectorAll('line');
            expect(lines.length).toBe(1);
        });

        it('should render "u"', () => {
            const { container } = render(<SetVocal text={'u'} />);

            const vocals = container.querySelectorAll('svg > g > circle');
            expect(vocals.length).toBe(1);

            const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
            expect(lineSlot.length).toBe(1);

            const groups = container.querySelectorAll('g');
            expect(groups.length).toBe(2);

            const circles = container.querySelectorAll('circle');
            expect(circles.length).toBe(3);

            const lines = container.querySelectorAll('line');
            expect(lines.length).toBe(1);
        });
    });

    describe('SVG Consonant', () => {
        const SetConsonant: React.FunctionComponent<{ text: string }> = ({ text }) => {
            const dispatch = useDispatch();
            const consonant = useRedux((state) => state.image.sentence.words.at(0)?.letters.at(0) as Consonant);
            useEffect(() => {
                dispatch(updateSentenceAction(text));
            }, []);

            return <svg>{consonant && <SVGConsonant {...consonant} fill="#000000" stroke="#000000" />}</svg>;
        };

        describe('No decoration', () => {
            it('should render "b"', () => {
                const { container } = render(<SetConsonant text={'b'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(1);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(1);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "j"', () => {
                const { container } = render(<SetConsonant text={'j'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(1);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(1);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "t"', () => {
                const { container } = render(<SetConsonant text={'t'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(1);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(1);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "th"', () => {
                const { container } = render(<SetConsonant text={'th'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(1);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(1);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });
        });

        describe('Double dot', () => {
            it('should render "ch"', () => {
                const { container } = render(<SetConsonant text={'ch'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "k"', () => {
                const { container } = render(<SetConsonant text={'k'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "sh"', () => {
                const { container } = render(<SetConsonant text={'sh'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "y"', () => {
                const { container } = render(<SetConsonant text={'y'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });
        });

        describe('Triple dot', () => {
            it('should render "d"', () => {
                const { container } = render(<SetConsonant text={'d'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(4);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "l"', () => {
                const { container } = render(<SetConsonant text={'l'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(4);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "r"', () => {
                const { container } = render(<SetConsonant text={'r'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(4);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });

            it('should render "z"', () => {
                const { container } = render(<SetConsonant text={'z'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const dots = container.querySelectorAll('svg > g > g > circle');
                expect(dots.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(4);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });
        });

        describe('Single line', () => {
            it('should render "g"', () => {
                const { container } = render(<SetConsonant text={'g'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(2);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(1);
            });

            it('should render "n"', () => {
                const { container } = render(<SetConsonant text={'n'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(2);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(1);
            });

            it('should render "v"', () => {
                const { container } = render(<SetConsonant text={'v'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(2);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(1);
            });

            it('should render "qu"', () => {
                const { container } = render(<SetConsonant text={'qu'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(2);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(3);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(1);
            });
        });

        describe('Double line', () => {
            it('should render "h"', () => {
                const { container } = render(<SetConsonant text={'h'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(5);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(2);
            });

            it('should render "p"', () => {
                const { container } = render(<SetConsonant text={'p'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(5);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(2);
            });

            it('should render "w"', () => {
                const { container } = render(<SetConsonant text={'w'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(5);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(2);
            });

            it('should render "x"', () => {
                const { container } = render(<SetConsonant text={'x'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(2);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(5);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(2);
            });
        });

        describe('Triple line', () => {
            it('should render "f"', () => {
                const { container } = render(<SetConsonant text={'f'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(7);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(3);
            });

            it('should render "m"', () => {
                const { container } = render(<SetConsonant text={'m'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(7);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(3);
            });

            it('should render "s"', () => {
                const { container } = render(<SetConsonant text={'s'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(7);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(3);
            });

            it('should render "ng"', () => {
                const { container } = render(<SetConsonant text={'ng'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const lineSlot = container.querySelectorAll('svg > g > g > line + circle + circle');
                expect(lineSlot.length).toBe(3);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(4);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(7);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(3);
            });
        });

        describe('Nested vocal', () => {
            it('should render nested vocal', () => {
                const { container } = render(<SetConsonant text={'ba'} />);

                const consonants = container.querySelectorAll('svg > g > circle');
                expect(consonants.length).toBe(1);

                const vocal = container.querySelectorAll('svg > g > g > g > circle');
                expect(vocal.length).toBe(1);

                const groups = container.querySelectorAll('g');
                expect(groups.length).toBe(3);

                const circles = container.querySelectorAll('circle');
                expect(circles.length).toBe(2);

                const lines = container.querySelectorAll('line');
                expect(lines.length).toBe(0);
            });
        });
    });
});
