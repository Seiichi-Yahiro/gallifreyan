import { useAppDispatch } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import uiThunks from '@/redux/thunks/uiThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import type { PointerEvent } from 'react';

const useDragAndDrop = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    return (event: PointerEvent) => {
        if (!event.isPrimary) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        dispatch(uiThunks.startDragging(id));
    };
};

export default useDragAndDrop;
