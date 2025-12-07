import actions from '@/redux/actions';
import type { AppThunkAction } from '@/redux/store';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';

const setSelection =
    (id: CircleId | LineSlotId | null): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.main.selected !== id && !state.main.dragging) {
            dispatch(actions.setSelection(id));
        }
    };

const startDrag =
    (id: CircleId | LineSlotId): AppThunkAction =>
    (dispatch, getState) => {
        const state = getState();

        if (state.main.selected === id && !state.main.dragging) {
            dispatch(actions.startDragging());
        }
    };

const thunks = {
    setSelection,
    startDrag,
};

export default thunks;
