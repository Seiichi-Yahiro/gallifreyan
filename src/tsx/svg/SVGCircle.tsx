import React from 'react';
import { UUID } from '../state/ImageTypes';
import SVGLineSlot from './LineSlot';

interface SVGCircleProps extends React.SVGProps<SVGCircleElement> {
    r: number;
    lineSlots: UUID[];
    filled: boolean;
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = React.memo(
    React.forwardRef(({ r, lineSlots, filled, stroke = 'inherit', fill = 'inherit', ...props }, ref) => (
        <>
            <circle ref={ref} {...props} cx={0} cy={0} r={r} stroke={stroke} fill={filled ? fill : 'transparent'} />
            {lineSlots.map((slot) => (
                <SVGLineSlot key={slot} id={slot} />
            ))}
        </>
    ))
);
