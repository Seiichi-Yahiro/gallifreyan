import { useAppDispatch } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import thunks from '@/redux/thunks';
import type { PointerEvent } from 'react';

const useDragAndDrop = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    return (event: PointerEvent) => {
        if (!event.isPrimary) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        dispatch(thunks.startDragging(id));
    };
};

export default useDragAndDrop;
