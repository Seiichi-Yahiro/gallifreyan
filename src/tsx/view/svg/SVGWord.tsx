import * as React from 'react';
import {partialCircle} from './SVGUtils';
import {CSSProperties} from 'react';
import Group from './Group';

export interface IWord {
    readonly id: string;
    text: string;
}

interface ISVGWordProps {
    word: IWord;
}

interface ISVGWordState {
    x: number;
    y: number;
}

class SVGWord extends React.Component<ISVGWordProps, ISVGWordState> {

    constructor(props: ISVGWordProps) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };
    }

    public render() {
        const {x, y} = this.state;
        const pathStyle: CSSProperties = {
            fill: 'transparent',
            strokeWidth: 1,
            stroke: '#000000'
        };

        return (
            <Group x={x} y={y}>
                <path d={partialCircle(0, 0, 50, 0, 2 * Math.PI)} style={pathStyle}/>
            </Group>
        );
    }
}

export default SVGWord;