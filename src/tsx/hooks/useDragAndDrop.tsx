import { useCallback, useState } from 'react';
import { UUID } from '../state/image/ImageTypes';
import { useIsSelectedSelector } from '../state/Selectors';
import { useAppDispatch } from './useAppDispatch';
import useEventListener from './useEventListener';
import { setIsDragging as reduxSetIsDragging } from '../state/work/WorkActions';

export const useDragAndDrop = (id: UUID, onMouseMove: (event: MouseEvent) => void): (() => void) => {
    const dispatch = useAppDispatch();
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
            dispatch(reduxSetIsDragging(false));
        },
        eventTarget
    );

    return useCallback(() => {
        if (isSelected) {
            setIsDragging(true);
            dispatch(reduxSetIsDragging(true));
        }
    }, [isSelected]);
};
