import React from 'react';
import { useRedux } from '../state/AppStore';
import { useLineSlotSelector } from '../state/Selectors';
import { Letter } from '../state/StateTypes';
import Group from './Group';
import { SVGCircle, SVGCuttingCircle } from './SVGCircle';
import SVGDot from './SVGDot';

interface LetterProps extends Letter {
    isCutting: boolean;
}

const SVGLetter: React.FunctionComponent<LetterProps> = ({ circleId, dots, isCutting }) => {
    const letterCircle = useRedux((state) => state.circles[circleId]);
    const lineSlots = useLineSlotSelector(letterCircle.lineSlots);

    return (
        <Group x={letterCircle.x} y={letterCircle.y}>
            {isCutting ? (
                <SVGCuttingCircle r={letterCircle.r} lineSlots={lineSlots} />
            ) : (
                <SVGCircle r={letterCircle.r} filled={letterCircle.filled} lineSlots={lineSlots} />
            )}
            {dots.map((dot) => (
                <SVGDot key={dot} id={dot} />
            ))}
        </Group>
    );
};

export default SVGLetter;
