import actions from '@/redux/actions';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import { type MouseEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.main.selected === id);

    const onSelect = (event: MouseEvent) => {
        event.stopPropagation();

        if (!isSelected) {
            dispatch(actions.setSelection(id));
        }
    };

    return { isSelected, onSelect };
};

export default useSelect;
