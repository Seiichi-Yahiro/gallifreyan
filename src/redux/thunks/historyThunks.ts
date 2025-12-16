import { historyActions } from '@/redux/slices/historySlice';
import type { AppThunkAction } from '@/redux/store';

const undo = (): AppThunkAction => (dispatch, getState) => {
    const { history, ...state } = getState();

    if (history.past.length === 0) {
        return;
    }

    dispatch(
        historyActions.undo({
            store: state,
            load: history.past[history.past.length - 1],
        }),
    );
};

const redo = (): AppThunkAction => (dispatch, getState) => {
    const { history, ...state } = getState();

    if (history.future.length === 0) {
        return;
    }

    dispatch(
        historyActions.redo({
            store: state,
            load: history.future[0],
        }),
    );
};

const save = (): AppThunkAction => (dispatch, getState) => {
    const { history: _history, ...state } = getState();
    dispatch(historyActions.save(state));
};

const historyThunks = {
    undo,
    redo,
    save,
};

export default historyThunks;
