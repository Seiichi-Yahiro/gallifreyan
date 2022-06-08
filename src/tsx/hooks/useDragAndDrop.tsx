import { useState } from 'react';
import { AppThunkAction } from '../state/AppState';
import { UUID } from '../state/image/ImageTypes';
import { useIsSelectedSelector } from '../state/Selectors';
import { Position } from '../utils/LinearAlgebra';
import { useAppDispatch } from './useAppDispatch';
import useEventListener from './useEventListener';
import { setIsDragging as reduxSetIsDragging } from '../state/work/WorkActions';

export const useDragAndDrop = (
    id: UUID,
    target: (EventTarget & Element) | undefined | null,
    dragAction: (id: UUID, domRect: DOMRect, mouseOffset: Position) => AppThunkAction
) => {
    const dispatch = useAppDispatch();
    const isSelected = useIsSelectedSelector(id);

    // can't use redux state here as the svg miniature would also trigger the events below
    const [isDragging, setIsDragging] = useState(false);

    useEventListener(
        'mousedown',
        () => {
            if (isSelected) {
                setIsDragging(true);
                dispatch(reduxSetIsDragging(true));
            }
        },
        target
    );

    const eventTarget = isDragging ? window : undefined;

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            const domRect = target!.getBoundingClientRect();
            const mouseOffset: Position = { x: event.movementX, y: event.movementY };
            dispatch(dragAction(id, domRect, mouseOffset));
        },
        eventTarget
    );

    useEventListener(
        'mouseup',
        () => {
            setIsDragging(false);
            dispatch(reduxSetIsDragging(false));
        },
        eventTarget
    );
};
