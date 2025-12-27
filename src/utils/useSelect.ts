import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import { interactionActions } from '@/redux/interactions/interaction.slice';
import type { CircleId } from '@/redux/svg/svg.types';
import { type MouseEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.interaction.selected === id);

    const onSelect = (event: MouseEvent) => {
        if (isSelected) {
            return;
        }

        event.stopPropagation();
        dispatch(interactionActions.setSelection(id));
    };

    return { isSelected, onSelect };
};

export default useSelect;
