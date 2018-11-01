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
}

class SVGLetter extends React.Component<ILetter> {

    public render() {

        const {x, y} = this.props;

        return (
            <Group x={x} y={y} className="svg-letter">
                <path d={partialCircle(0, 0, 25, 0, 2 * Math.PI)}/>
            </Group>
        );
    }
}

export default SVGLetter;