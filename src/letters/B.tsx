import * as React from 'react';
import {partialCircle} from '../utils/canvasUtils';

interface ILetterBProps {
    x: number;
    y: number;
    radius: number;
}

const B: React.StatelessComponent<ILetterBProps> = ({x, y, radius}) => {
    const circlePath = partialCircle(radius/2, radius/2, radius, 0, Math.PI*2);

    return (
        <g transform={`translate(${x}, ${y})`} width={radius*2} height={radius*2}>
            <path stroke="black" strokeWidth="1" fill="transparent" d={circlePath + ' Z'} />
        </g>
    );
};

export default B;