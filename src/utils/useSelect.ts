import { useAppDispatch, useRedux } from '@/redux/hooks';
import type { LineSlotId } from '@/redux/ids';
import interactionThunks from '@/redux/thunks/interactionThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import { type MouseEvent } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.interaction.selected === id);

    const onSelect = (event: MouseEvent) => {
        event.stopPropagation();
        dispatch(interactionThunks.select(id));
    };

    return { isSelected, onSelect };
};

export default useSelect;
