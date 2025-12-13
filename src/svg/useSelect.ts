import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import thunks from '@/redux/thunks';
import { type MouseEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.main.selected === id);

    const onSelect = (event: MouseEvent) => {
        event.stopPropagation();
        dispatch(thunks.setSelection(id));
    };

    return { isSelected, onSelect };
};

export default useSelect;
