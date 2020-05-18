import React from 'react';
import { useRedux } from '../state/AppStore';
import { Letter } from '../state/StateTypes';
import Group from './Group';
import { SVGCircle, SVGCuttingCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface LetterProps extends Letter {
    isCutting: boolean;
}

const SVGLetter: React.FunctionComponent<LetterProps> = ({ circleId, dots, isCutting }) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);

    return (
        <Group x={letterCircle.x} y={letterCircle.y}>
            {isCutting ? (
                <SVGCuttingCircle r={letterCircle.r} />
            ) : (
                <SVGCircle r={letterCircle.r} filled={letterCircle.filled} />
            )}
            {dots.map((dot) => (
                <SVGDot key={dot} id={dot} />
            ))}
        </Group>
    );
};

export default SVGLetter;
