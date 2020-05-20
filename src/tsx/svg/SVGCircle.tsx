import React from 'react';
import { LineSlot } from '../state/StateTypes';
import SVGLineSlot from './LineSlot';

interface SVGCircleProps extends React.SVGProps<SVGCircleElement> {
    r: number;
    lineSlots: LineSlot[];
    filled?: boolean;
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = ({
    r,
    lineSlots,
    filled = false,
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
