import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { dragDot } from '../state/image/ImageThunks';
import { Dot, UUID } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { setHovering } from '../state/work/WorkActions';
import { selectDot } from '../state/work/WorkThunks';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';

interface DotProps {
    id: UUID;
}

const lineSlots: UUID[] = [];

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const { circle: dot, isSelected, isHovered } = useCircleSelector<Dot>(id);
    const dispatch = useAppDispatch();
    const dotRef = useRef<SVGCircleElement>(null);

    useDragAndDrop(id, dotRef.current, dragDot);

    return (
        <Group
            angle={dot.circle.angle}
            distance={dot.circle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-dot"
        >
            <SVGCircle
                ref={dotRef}
                r={dot.circle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={true}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(selectDot(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
