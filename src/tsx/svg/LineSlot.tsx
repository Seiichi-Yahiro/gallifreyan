import React from 'react';
import { LineSlot } from '../state/StateTypes';
import { calculateTranslation } from '../utils/TextTransforms';

interface SVGLineSlotProps extends LineSlot {}

const SVGLineSlot: React.FunctionComponent<SVGLineSlotProps> = ({ angle, parentDistance }) => {
    const { x, y } = calculateTranslation(angle, parentDistance);
    const length = Math.sqrt(x * x + y * y);
    const lineLength = 10;
    const xDir = (lineLength * x) / length;
    const yDir = (lineLength * y) / length;

    return <line x1={x} y1={y} x2={x + xDir} y2={y + yDir} strokeWidth={1} stroke="#000000" />;
};

export default SVGLineSlot;
