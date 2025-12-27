import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LetterId } from '@/redux/ids';
import dragThunks from '@/redux/svg/drag.thunks';
import { calculateIntersectionsBetweenLetterAndWord } from '@/redux/svg/intersections';
import type { Arc } from '@/redux/svg/svg.types';
import { LetterPlacement } from '@/redux/text/letter.types';
import SvgArc from '@/svg/SvgArc';
import SvgCircle from '@/svg/SvgCircle';
import SvgDot from '@/svg/SvgDot';
import SvgGroup from '@/svg/SvgGroup';
import SvgLineSlot from '@/svg/SvgLineSlot';
import useSvgDragAndDrop from '@/svg/useSvgDragAndDrop';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React, { useLayoutEffect, useMemo } from 'react';

interface SvgLetterProps {
    id: LetterId;
    setWordAntiArc: (letterId: LetterId, arc: Arc | undefined) => void;
}

const SvgLetter: React.FC<SvgLetterProps> = ({ id, setWordAntiArc }) => {
    const dispatch = useAppDispatch();

    const dots = useRedux((state) => state.text.elements[id].dots);

    const lineSlots = useRedux((state) => state.text.elements[id].lineSlots);

    const placement = useRedux(
        (state) => state.text.elements[id].letter.placement,
    );

    const circle = useRedux((state) => state.svg.circles[id]);

    const wordCircleRadius = useRedux(
        (state) => state.svg.circles[state.text.elements[id].parent].radius,
    );

    const intersections = useMemo(() => {
        if (
            placement !== LetterPlacement.DeepCut &&
            placement !== LetterPlacement.ShallowCut
        ) {
            return;
        }

        return calculateIntersectionsBetweenLetterAndWord(
            wordCircleRadius,
            circle,
        );
    }, [circle, placement, wordCircleRadius]);

    useLayoutEffect(() => {
        setWordAntiArc(id, intersections?.wordAntiArc);

        return () => {
            setWordAntiArc(id, undefined);
        };
    }, [id, intersections, setWordAntiArc]);

    const { isHovered, onHover, onHoverStop } = useHover(id);
    const { isSelected, onSelect } = useSelect(id);
    const { onPointerDown } = useSvgDragAndDrop((pointerData) => {
        dispatch(dragThunks.letter(id, pointerData.movement));
    });

    return (
        <SvgGroup
            distance={circle.position.distance}
            angle={circle.position.angle}
            rotateInParent={true}
        >
            {intersections ? (
                <SvgArc
                    radius={circle.radius}
                    arcs={[intersections.letterArc]}
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
