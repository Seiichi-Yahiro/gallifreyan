import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import thunks from '@/redux/thunks';
import { type MouseEvent, type PointerEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.main.selected === id);

    const onSelect = (event: MouseEvent) => {
        event.stopPropagation();
        dispatch(thunks.setSelection(id));
    };

    const startDrag = (event: PointerEvent) => {
        if (!event.isPrimary) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();
        dispatch(thunks.startDrag(id));
    };

    return { isSelected, onSelect, startDrag };
};

export default useSelect;
