import * as React from 'react';
import Group from './Group';
import {partialCircle} from './SVGUtils';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng',
}

export interface ILetter {
    letter: string;
    x: number;
    y: number;
    r: number;
    anglesOfLetter?: number[];
    anglesOfWord?: number[];
}

class SVGLetter extends React.Component<ILetter> {

    public render() {

        const {getPartialCircle} = this;
        const {x, y, r, anglesOfLetter} = this.props;

        return (
            <Group x={x} y={y} className="svg-letter">
                {anglesOfLetter
                    ? getPartialCircle()
                    : <circle r={r}/>
                }

            </Group>
        );
    }

    private getPartialCircle = () => {
        const {anglesOfLetter, r} = this.props;

        if (anglesOfLetter) {
            const [start, end] = anglesOfLetter;

            return <path d={partialCircle(0, 0, r, start < end ? start + 2 * Math.PI : start, end)}/>;
        }

        return undefined;
    }
}

export default SVGLetter;