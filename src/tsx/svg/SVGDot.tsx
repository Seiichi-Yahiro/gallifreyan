import React, { useRef } from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { dragDot } from '../state/image/ImageThunks';
import { Dot, UUID } from '../state/image/ImageTypes';
import { useCircleSelector } from '../state/Selectors';
import { selectDot } from '../state/work/WorkThunks';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';

interface DotProps {
    id: UUID;
}

const lineSlots: UUID[] = [];

const SVGDot: React.FunctionComponent<DotProps> = ({ id }) => {
    const { circle: dot, isSelected, isHovered } = useCircleSelector<Dot>(id);
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
                id={id}
                select={selectDot}
                ref={dotRef}
                r={dot.circle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={true}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
