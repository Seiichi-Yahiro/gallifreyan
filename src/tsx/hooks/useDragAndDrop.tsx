import React, { useCallback, useState } from 'react';
import { UUID } from '../state/ImageTypes';
import { useIsSelectedSelector } from '../state/Selectors';
import { calculateAngle, calculateParentDistance, calculateParentPos } from '../utils/DragAndDrop';
import { Position, Vector2 } from '../utils/LinearAlgebra';
import useEventListener from './useEventListener';
import { useRedux } from './useRedux';

interface PositionData {
    parentDistance: number;
    angle: number;
}

export const useDragAndDrop = (
    id: UUID,
    element: React.RefObject<Element>,
    translation: Vector2,
    onMouseMove: (positionData: PositionData) => void
): (() => void) => {
    const viewPortScale = useRedux((state) => state.svgPanZoom.value.a);
    const isSelected = useIsSelectedSelector(id);

    // can't use redux state here as the svg miniature would also trigger the events below
    const [isDragging, setIsDragging] = useState(false);

    const eventTarget = isDragging ? window : undefined;

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();

            if (element.current) {
                const parentPos = calculateParentPos(element.current, translation, viewPortScale);
                const mousePos: Position = { x: event.clientX, y: event.clientY };
                const parentDistance = calculateParentDistance(mousePos, parentPos, viewPortScale);
                const angle = calculateAngle(mousePos, parentPos);
                onMouseMove({ parentDistance, angle });
            }
        },
        eventTarget
    );

    useEventListener(
        'mouseup',
        () => {
            setIsDragging(false);
        },
        eventTarget
    );

    return useCallback(() => {
        if (isSelected) {
            setIsDragging(true);
        }
    }, [isSelected]);
};
