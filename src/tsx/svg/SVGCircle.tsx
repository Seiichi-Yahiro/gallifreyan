import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { AppThunkAction } from '../state/AppState';
import { UUID } from '../state/image/ImageTypes';
import { setHovering } from '../state/work/WorkActions';
import SVGLineSlot from './LineSlot';

interface SVGCircleProps extends React.SVGProps<SVGCircleElement> {
    id: UUID;
    select: (id: UUID) => AppThunkAction;
    r: number;
    lineSlots: UUID[];
    filled: boolean;
}

export const SVGCircle: React.FunctionComponent<SVGCircleProps> = React.memo(
    React.forwardRef(({ id, select, r, lineSlots, filled, stroke = 'inherit', fill = 'inherit', ...props }, ref) => {
        const dispatch = useAppDispatch();

        return (
            <>
                <circle
                    ref={ref}
                    {...props}
                    cx={0}
                    cy={0}
                    r={r}
                    stroke={stroke}
                    fill={filled ? fill : 'transparent'}
                    onClick={(event: React.MouseEvent<SVGCircleElement>) => {
                        dispatch(select(id));
                        event.stopPropagation();
                    }}
                    onMouseEnter={() => {
                        dispatch(setHovering(id));
                    }}
                    onMouseLeave={() => {
                        dispatch(setHovering());
                    }}
                />
                {lineSlots.map((slot) => (
                    <SVGLineSlot key={slot} id={slot} />
                ))}
            </>
        );
    })
);
