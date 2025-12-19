import { useRedux } from '@/redux/hooks';
import type { LetterId } from '@/redux/ids';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgDot from '@/svg/SvgDot';
import SvgGroup from '@/svg/SvgGroup';
import SvgLineSlot from '@/svg/SvgLineSlot';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React from 'react';

interface SvgLetterProps {
    id: LetterId;
}

const SvgLetter: React.FC<SvgLetterProps> = ({ id }) => {
    const dots = useRedux((state) => state.text.elements[id].dots);

    const lineSlots = useRedux((state) => state.text.elements[id].lineSlots);

    const circle = useRedux((state) => state.svg.circles[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop(id);

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            {circle.arc ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={[circle.arc]}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={isSelected ? onPointerDown : undefined}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            ) : (
                <SvgCircle
                    radius={circle.radius}
                    className="letter"
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverStop}
                    onClick={onSelect}
                    onPointerDown={isSelected ? onPointerDown : undefined}
                    isHovered={isHovered}
                    isSelected={isSelected}
                />
            )}
            {dots.map((dotId) => (
                <SvgDot key={dotId} id={dotId} />
            ))}
            {lineSlots.map((lineSlotId) => (
                <SvgLineSlot key={lineSlotId} id={lineSlotId} />
            ))}
        </SvgGroup>
    );
};

export default SvgLetter;
