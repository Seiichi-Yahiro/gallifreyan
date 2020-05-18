import React from 'react';
import { LineSlot } from '../state/StateTypes';
import SVGLineSlot from './LineSlot';

interface SVGCircleProps {
    r: number;
    filled: boolean;
    lineSlots: LineSlot[];
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = ({ r, filled, lineSlots }) => (
    <>
        <circle cx={0} cy={0} r={r} stroke="#000000" fill={filled ? '#000000' : 'transparent'} />
        {lineSlots.map((slot) => (
            <SVGLineSlot key={slot.id} {...slot} />
        ))}
    </>
);

interface SVGMaskedCircleProps {
    r: number;
    maskId: string;
}

export const SVGMaskedCircle: React.FunctionComponent<SVGMaskedCircleProps> = ({ r, maskId }) => (
    <circle cx={0} cy={0} r={r} stroke="#000000" fill="#000000" mask={`url(#${maskId})`} />
);

interface SVGCuttingCircleProps {
    r: number;
    lineSlots: LineSlot[];
}

export const SVGCuttingCircle: React.FunctionComponent<SVGCuttingCircleProps> = ({ r, lineSlots }) => (
    <>
        <circle cx={0} cy={0} r={r} stroke="none" fill="transparent" />
        {lineSlots.map((slot) => (
            <SVGLineSlot key={slot.id} {...slot} />
        ))}
    </>
);
