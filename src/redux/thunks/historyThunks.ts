import { historyActions, type HistoryState } from '@/redux/slices/historySlice';
import type { AppState, AppThunkAction } from '@/redux/store';

const extractHistoryState = (state: AppState): HistoryState => {
    return {
        text: state.text,
        svg: state.svg,
        ui: state.ui,
    };
};

const undo = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.history.past.length === 0) {
        return;
    }

    dispatch(
        historyActions.undo({
            store: extractHistoryState(state),
            load: state.history.past[state.history.past.length - 1],
        }),
    );
};

const redo = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();

    if (state.history.future.length === 0) {
        return;
    }

    dispatch(
        historyActions.redo({
            store: extractHistoryState(state),
            load: state.history.future[0],
        }),
    );
};

const save = (): AppThunkAction => (dispatch, getState) => {
    const state = getState();
    const historyState = extractHistoryState(state);
    dispatch(historyActions.save(historyState));
};

const historyThunks = {
    undo,
    redo,
    save,
};

export default historyThunks;
