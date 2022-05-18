import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import useHover from '../hooks/useHover';
import { useRedux } from '../hooks/useRedux';
import { updateLineSlotData } from '../state/ImageState';
import { UUID } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { add, mul, normalize, Position, Vector2 } from '../utils/LinearAlgebra';
import { calculateTranslation } from '../utils/TextTransforms';
import Group, { AnglePlacement } from './Group';

interface SVGLineSlotProps {
    id: UUID;
    parentAngle: number;
}

const SVGLineSlot: React.FunctionComponent<SVGLineSlotProps> = ({ id, parentAngle }) => {
    const { angle, distance } = useRedux((state) => state.image.lineSlots[id]);
    const dispatch = useDispatch();
    const isHoveredSlot = useIsHoveredSelector(id);
    const isSelectedSlot = useIsSelectedSelector(id);
    const slotCircleRef = useRef<SVGCircleElement>(null);
    const { isHovered: isHoveredConnection, toggleHover: toggleConnectionHover } = useHover();

    const translation = calculateTranslation(angle, distance);

    const lineLength = 10;
    const lineStart: Position = translation;
    const direction: Vector2 = mul(normalize(translation), lineLength);
    const lineEnd: Position = add(translation, direction);

    const onMouseDown = useDragAndDrop(id, slotCircleRef, { distance, angle, parentAngle }, (positionData) =>
        dispatch(updateLineSlotData({ id, ...positionData }))
    );

    return (
        <Group
            angle={0}
            distance={0}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHoveredSlot || isHoveredConnection}
            isSelected={isSelectedSlot}
            className="group-line-slot"
        >
            <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} strokeWidth={1} stroke="inherit" />
            <circle
                ref={slotCircleRef}
                cx={lineStart.x}
                cy={lineStart.y}
                r={5}
                fill="transparent"
                stroke={isHoveredSlot || isSelectedSlot ? 'inherit' : 'none'}
                onClick={(event) => {
                    if (!isSelectedSlot) {
                        dispatch(setSelection(id));
                    }
                    event.stopPropagation();
                }}
                onMouseDown={onMouseDown}
                onMouseEnter={() => dispatch(setHovering(id))}
                onMouseLeave={() => dispatch(setHovering())}
            />
            <circle
                cx={lineEnd.x}
                cy={lineEnd.y}
                r={5}
                fill="transparent"
                stroke={isHoveredConnection ? 'inherit' : 'none'}
                onMouseEnter={toggleConnectionHover(true)}
                onMouseLeave={toggleConnectionHover(false)}
            />
        </Group>
    );
};

export default React.memo(SVGLineSlot);
