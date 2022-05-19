import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useRedux } from '../hooks/useRedux';
import { moveDot } from '../state/ImageState';
import { UUID } from '../state/ImageTypes';
import { useIsHoveredSelector, useIsSelectedSelector } from '../state/Selectors';
import { setHovering, setSelection } from '../state/WorkState';
import { Position } from '../utils/LinearAlgebra';
import Group, { AnglePlacement } from './Group';
import { SVGCircle } from './SVGCircle';

interface DotProps {
    id: UUID;
    parentAngle: number;
}

const lineSlots: UUID[] = [];

const SVGDot: React.FunctionComponent<DotProps> = ({ id, parentAngle }) => {
    const dotCircle = useRedux((state) => state.image.circles[id]);
    const dispatch = useAppDispatch();
    const isHovered = useIsHoveredSelector(id);
    const isSelected = useIsSelectedSelector(id);
    const dotRef = useRef<SVGCircleElement>(null);

    const onMouseDown = useDragAndDrop(id, (event) => {
        if (dotRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const domRect = dotRef.current.getBoundingClientRect();

            dispatch(moveDot(mousePos, { id, domRect }, { angle: parentAngle }));
        }
    });

    return (
        <Group
            angle={dotCircle.angle}
            distance={dotCircle.distance}
            anglePlacement={AnglePlacement.Absolute}
            isHovered={isHovered}
            isSelected={isSelected}
            className="group-dot"
        >
            <SVGCircle
                ref={dotRef}
                r={dotCircle.r}
                lineSlots={lineSlots}
                fill="inherit"
                stroke="inherit"
                filled={true}
                onClick={useCallback(
                    (event: React.MouseEvent<SVGCircleElement>) => {
                        if (!isSelected) {
                            dispatch(setSelection(id));
                        }
                        event.stopPropagation();
                    },
                    [id, isSelected]
                )}
                onMouseDown={onMouseDown}
                onMouseEnter={useCallback(() => dispatch(setHovering(id)), [id])}
                onMouseLeave={useCallback(() => dispatch(setHovering()), [])}
            />
        </Group>
    );
};

export default React.memo(SVGDot);
