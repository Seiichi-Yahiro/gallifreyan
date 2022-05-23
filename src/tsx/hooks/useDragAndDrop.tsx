import { useCallback, useState } from 'react';
import { UUID } from '../state/image/ImageTypes';
import { useIsSelectedSelector } from '../state/Selectors';
import useEventListener from './useEventListener';

export const useDragAndDrop = (id: UUID, onMouseMove: (event: MouseEvent) => void): (() => void) => {
    const isSelected = useIsSelectedSelector(id);

    // can't use redux state here as the svg miniature would also trigger the events below
    const [isDragging, setIsDragging] = useState(false);

    const eventTarget = isDragging ? window : undefined;

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            onMouseMove(event);
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
