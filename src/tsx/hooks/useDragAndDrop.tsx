import React, { useCallback, useState } from 'react';
import { PositionData, UUID } from '../state/ImageTypes';
import { useIsSelectedSelector } from '../state/Selectors';
import { calculateAngle, calculatedistance, calculateParentPos } from '../utils/DragAndDrop';
import { Position } from '../utils/LinearAlgebra';
import { adjustAngle, calculateTranslation } from '../utils/TextTransforms';
import useEventListener from './useEventListener';
import { useRedux } from './useRedux';

export const useDragAndDrop = (
    id: UUID,
    element: React.RefObject<Element>,
    positionData: PositionData & { parentAngle?: number },
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
                const parentAngle = positionData.parentAngle ?? 0;
                const translation = calculateTranslation(positionData.angle + parentAngle, positionData.distance);
                const parentPos = calculateParentPos(element.current, translation, viewPortScale);
                const mousePos: Position = { x: event.clientX, y: event.clientY };
                onMouseMove({
                    distance: calculatedistance(mousePos, parentPos, viewPortScale),
                    angle: adjustAngle(calculateAngle(mousePos, parentPos) - parentAngle),
                });
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
