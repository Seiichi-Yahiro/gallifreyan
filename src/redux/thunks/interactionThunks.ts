import ids, { type LineSlotId } from '@/redux/ids';
import { interactionActions } from '@/redux/slices/interactionSlice';
import type { AppThunkAction } from '@/redux/store';
import wordThunks from '@/redux/thunks/wordThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import { match } from 'ts-pattern';

const select =
    (id: CircleId | LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.interaction.selected === id) {
            return;
        }

        dispatch(interactionActions.setSelection(id));

        match(id)
            .when(ids.word.is, (wordId) => {
                dispatch(wordThunks.calculatePositionConstraints(wordId));
            })
            .otherwise(() => {
                // TODO
            });
    };

const uiThunks = {
    select,
};

export default uiThunks;
