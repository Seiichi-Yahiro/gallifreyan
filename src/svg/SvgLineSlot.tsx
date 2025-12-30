import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import dragThunks from '@/redux/svg/drag.thunks';
import SvgGroup from '@/svg/SvgGroup';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import cn from '@/utils/cn';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React from 'react';

interface SvgLineSlotProps {
    id: LineSlotId;
}

const SvgLineSlot: React.FC<SvgLineSlotProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const lineSlot = useRedux((state) => state.svg.lineSlots[id]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop((pointerData) => {
        dispatch(dragThunks.lineSlot(id, pointerData.movement));
    });

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
                className="transition-colors--not-print line"
            />
            <circle
                cx={0}
                cy={0}
                r={8}
                className={cn('transition-colors--not-print line-slot', {
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
