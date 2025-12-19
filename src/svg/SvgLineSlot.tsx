import { useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import SvgGroup from '@/svg/SvgGroup';
import useHover from '@/svg/useHover';
import useSelect from '@/svg/useSelect';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import cn from '@/utils/cn';
import React from 'react';

interface SvgLineSlotProps {
    id: LineSlotId;
}

const SvgLineSlot: React.FC<SvgLineSlotProps> = ({ id }) => {
    const lineSlot = useRedux((state) => state.svg.lineSlots[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop(id);

    return (
        <SvgGroup
            distance={lineSlot.position.distance}
            angle={lineSlot.position.angle}
            rotateInParent={true}
            className="print:hidden"
        >
            <line
                x1={0}
                y1={0}
                x2={0}
                y2={20}
                className="transition-colors--not-print line-slot"
            />
            <circle
                cx={0}
                cy={0}
                r={8}
                className={cn('transition-colors--not-print', {
                    'hovered__stroke--not-print': isHovered,
                    'selected__stroke--not-print': isSelected,
                })}
                fill="transparent"
                onMouseEnter={onHover}
                onMouseLeave={onHoverStop}
                onClick={onSelect}
                onPointerDown={isSelected ? onPointerDown : undefined}
            />
        </SvgGroup>
    );
};

export default SvgLineSlot;
