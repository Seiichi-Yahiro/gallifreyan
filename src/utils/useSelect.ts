import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import uiThunks from '@/redux/thunks/uiThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import { type MouseEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.ui.selected === id);

    const onSelect = (event: MouseEvent) => {
        event.stopPropagation();
        dispatch(uiThunks.setSelection(id));
    };

    return { isSelected, onSelect };
};

export default useSelect;
