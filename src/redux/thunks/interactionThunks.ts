import { type LineSlotId } from '@/redux/ids';
import { interactionActions } from '@/redux/slices/interactionSlice';
import type { AppThunkAction } from '@/redux/store';
import type { CircleId } from '@/redux/types/svgTypes';

const select =
    (id: CircleId | LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.interaction.selected === id) {
            return;
        }

        dispatch(interactionActions.setSelection(id));
    };

const interactionThunks = {
    select,
};

export default interactionThunks;
