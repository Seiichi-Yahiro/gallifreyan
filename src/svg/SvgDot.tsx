import { useRedux } from '@/redux/hooks';
import type { DotId } from '@/redux/ids';
import SvgCircle from '@/svg/SvgCircle';
import SvgGroup from '@/svg/SvgGroup';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React from 'react';

interface SvgDotProps {
    id: DotId;
}

const SvgDot: React.FC<SvgDotProps> = ({ id }) => {
    const circle = useRedux((state) => state.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={false}
        >
            <SvgCircle
                radius={circle.radius}
                filled={true}
                className="dot"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                onPointerDown={isSelected ? onPointerDown : undefined}
                isHovered={isHovered}
                isSelected={isSelected}
            />
        </SvgGroup>
    );
};

export default SvgDot;
