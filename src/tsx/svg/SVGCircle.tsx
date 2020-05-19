import React from 'react';
import { LineSlot } from '../state/StateTypes';
import SVGLineSlot from './LineSlot';

interface SVGCircleProps extends React.SVGProps<SVGCircleElement> {
    r: number;
    filled: boolean;
    lineSlots: LineSlot[];
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = ({
    r,
    filled,
    lineSlots,
    stroke = 'inherit',
    fill = 'inherit',
    ...props
}) => (
    <>
        <circle {...props} cx={0} cy={0} r={r} stroke={stroke} fill={filled ? fill : 'transparent'} />
        {lineSlots.map((slot) => (
            <SVGLineSlot key={slot.id} {...slot} />
        ))}
    </>
);

interface SVGMaskedCircleProps extends React.SVGProps<SVGCircleElement> {
    r: number;
    maskId: string;
}

export const SVGMaskedCircle: React.FunctionComponent<SVGMaskedCircleProps> = ({ r, maskId, ...props }) => (
    <circle {...props} cx={0} cy={0} r={r} stroke="inherit" fill="inherit" mask={`url(#${maskId})`} />
);
